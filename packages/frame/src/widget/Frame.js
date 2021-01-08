import {Widget} from "@zasada/widget";

/**
 * Фрейм, контейнер html, c методами для обновления данных
 */
export class Frame extends Widget {

	/**
	 * @type {boolean} можно ли при переходе по новой ссылке обновлять контент по кешу, если url совпадает?
	 */
	bCache = true;

	/**
	 * @type {number} максимальное количество элементов в кеше готовых контейнеров
	 */
	iCacheLen = 5;

	/**
	 * @type {boolean} можно ли при переходе по новой ссылке доставать контент,
	 * который предварительно загружен через aPreloadUrls
	 */
	bPreload = true;

	/**
	 * @type {boolean} нужно ли делать scrollTop после обновления фрейма?
	 */
	bScroll = false;

	/**
	 * @type {string} текущий url у фрейма
	 */
	sUrl = '';

	/**
	 * @type {null|boolean} если null, то POST http запрос будет если будет oFormData
	 */
	bPost = null;

	/**
	 * @type {object} данные фрейма
	 */
	oCustomData = {};

	/**
	 * @type {string[]} массив ссылок для предзагрузки
	 */
	aPreloadUrls = [];

	_oPreloads = {};

	_sFrameId;

	_bPreloadNow = false;

	_oCache = {};

	_oUrlStateIdRel = {}; // sUrl => iStateId

	_oXhr;

	_iStateId = 1;

	/**
	 * @type {number} указатель на следующий свободный state
	 */
	_iStateIdNextId = 1;

	/**
	 * @type {Promise} внутренний Promise
	 */
	_oPromise;

	/**
	 * @type {function[]} массив функций resolve фрейма
	 */
	_aResolve = [];

	/**
	 * @type {function[]} массив функций reject фрейма
	 */
	_aReject = [];

	_iLastTime;

	newXhr;

	oneStorage;

	_getIndex() {
		return this.getFrameId();
	}

	run() {

		this._my({
			'cache-len': 'i:iCacheLen',
			'cache': 'b:bCache',
			'url': 'sUrl',
			'scroll': 'b:bScroll',
			'post': 'b:bPost',
			'custom-data': 'js:oCustomData',
		});
		if( !this.sUrl ) {
			this.sUrl = location.pathname + location.search
		}
		this.sUrl = this._absUrl( this.sUrl );
		this._oUrlStateIdRel[ this.sUrl ] = this._iStateId;
	}

	update( oOpts ) {

		oOpts = this._prepareOpts( oOpts );

		// обработка закешированного контента
		const iCacheStateId = this._updateFromCache( oOpts );
		if( iCacheStateId ) {
			return Promise.resolve( iCacheStateId );
		}

		// сохраняем состояние
		//this._saveState( this._iStateId );

		// следующий iStateId
		//this._iStateId = ++this._iStateIdNextId;

		//this._fire( this.bl(), 'beforeFetch', { oWidget: this, sUrl: oOpts.sUrl } );

		// запрашиваем сервер
		return this._getData( oOpts ).then( ( oResponse ) => {

			// сохраняем состояние
			this._saveState( this._iStateId );

			// следующий iStateId
			this._iStateId = ++this._iStateIdNextId;

			this._fire( this.bl(), 'beforeFetch', { oWidget: this, sUrl: oOpts.sUrl } );

			this.oCustomData = oOpts.oCustomData;
			return this._updateBody( oResponse ).then( () => {
				return this._afterUpdate( oOpts, oResponse.sUrl );
			} );
		} );
	}

	reload() {
		return this.update( { bCache: false, bPreload: false } );
	}

	url() {
		return this.sUrl;
	}

	stateId() {
		return this._iStateId;
	}
	
	customData() {
		return this.oCustomData;
	}

	/**
	 * возможность использовать Frame как deferred объект
	 * сработает resolve при json ответе сервера
	 */
	// возможность использовать
	promise() {
		return new Promise( ( fnResolve, fnReject ) => {
			this._aResolve.push( fnResolve );
			this._aReject.push( fnReject );
		} );
	}

	resolve( mValue ) {
		this._aResolve.forEach( ( fnResolve ) => {
			fnResolve( mValue );
		} );
		this._aResolve = this._aReject = [];
	}

	reject( mValue ) {
		this._aReject.forEach( ( fnReject ) => {
			fnReject( mValue );
		} );
		this._aResolve = this._aReject = [];
	}

	preloadUrls( aPreloadUrls ) {
		this.aPreloadUrls.push( ...aPreloadUrls );
		if( !this._bPreloadNow ) {
			this._preloadFetch();
		}
	}

	_updateFromCache( oOpts ) {
		if(
			!oOpts.sUrl
			||
			!oOpts.bCache
			||
			oOpts.oFormData
			||
			oOpts.sContent
			||
			!this._oUrlStateIdRel[ oOpts.sUrl ]
		) {
			return false;
		}
		let iStateId = this._oUrlStateIdRel[ oOpts.sUrl ];
		if( oOpts.sUrl === this.sUrl && iStateId === this._iStateId ) {
			return this._iStateId;
		}

		if( !this.hasState( iStateId ) ) {
			return false;
		}
		this.toState( iStateId );
		iStateId = this._afterUpdate( oOpts );
		this._fire( '', 'toStateFromCache', { oOpts, iStateId } );
		return iStateId;
	}

	_getData( oOpts ) {
		if( oOpts.sContent ) {
			return Promise.resolve( { sHtml: oOpts.sContent, sUrl: oOpts.sUrl, oJson: null } );
		}
		if( oOpts.bPreload && !oOpts.oFormData && this._oPreloads[ oOpts.sUrl ] ) {
			return Promise.resolve( this._oPreloads[ oOpts.sUrl ] );
		}
		return this._fetch( oOpts );
	}

	_afterUpdate( oOpts, sNewUrl = null ) {

		// если был запрос с #, то с сервера он не придет
		// в таком случае sNewUrl должен быть с изначальным #
		let sHash = '';
		if( sNewUrl !== null ) {
			let iHashIndex = oOpts.sUrl.indexOf( '#' );
			if( iHashIndex !== -1 ) {
				let sOriginUrl = oOpts.sUrl.substr( 0, iHashIndex );
				if( sOriginUrl === sNewUrl ) {
					sNewUrl = oOpts.sUrl;
					sHash = oOpts.sUrl.substr( iHashIndex + 1 );
				}
			}
		} else {
			sNewUrl = oOpts.sUrl;
		}

		this.sUrl = sNewUrl;
		if( sNewUrl !== oOpts.sUrl ) {
			this._fire( '', 'changeUrl', { oWidget: this, sUrl: sNewUrl } );
		}

		this._scroll( oOpts, sHash );

		this._oUrlStateIdRel[ this.sUrl ] = this._iStateId;
		return this._iStateId;
	}

	_scroll( oOpts, sHash ) {
		if( !oOpts.bScroll ) {
			return
		}
		let eAnchor;
		if( sHash ) {
			eAnchor = document.querySelector( '[id="' + sHash + '"]' );
			if( !eAnchor ) {
				eAnchor = document.querySelector( '[name="' + sHash + '"]' );
			}
			if( eAnchor ) {
				eAnchor.scrollIntoView();
			}
		}
		if( !eAnchor ) {
			window.scrollTo( 0, 0 );
		}
	}

	/**
	 * @param {any} oResponse
	 * @return {Promise<any>}
	 */
	_updateBody( oResponse ) {
		if( oResponse.oJson ) {
			this.resolve( oResponse.oJson );
			return Promise.resolve();
		} else {
			return this._html( '', oResponse.sHtml );
		}
	}

	_fetch( oOpts ) {

		return new Promise( ( fnResolve, fnReject ) => {
			let oXhr = this._oXhr;
			if( oXhr ) {
				if( oXhr.readyState !== 4 ) {
					oXhr.abort();
				}
			} else {
				this._oXhr = oXhr = this.newXhr();
			}

			oXhr.onreadystatechange = () => {
				this._onStateChange( fnResolve, fnReject );
			};
			this._xhrSend( oOpts );
		} );
	}

	_onStateChange( fnResolve, fnReject ) {
		const oXhr = this._oXhr;
		if( oXhr.readyState !== 4 ) {
			return;
		}
		if ( oXhr.status < 200 || oXhr.status >= 400 ) {
			fnReject( oXhr.responseText );
			return;
		}
		fnResolve( this._parseXhr( oXhr ) );
	}

	_xhrSend( oOpts ) {

		const oXhr = this._oXhr;
		let { sUrl, bPost, oFormData } = oOpts;
		if( oFormData && !bPost ) {
			// если есть данные, и это не POST, добавим их в URL
			let sParams = [ ...oFormData.entries() ]
				.map( aParam => encodeURIComponent( aParam[0] ) + "=" + encodeURIComponent( aParam[1] ) )
				.join( "&" );
			sUrl += ( sUrl.indexOf( '?' ) === -1 ? '?' : '&' ) + sParams;
		}
		oXhr.open( bPost ? 'POST' :'GET', sUrl, true );
		this._addHeaders( oOpts );
		oXhr.send( oFormData );

	}

	_addHeaders( oOpts ) {
		const oXhr = this._oXhr;
		oXhr.setRequestHeader( 'X-PJAX', 'true' );
		oXhr.setRequestHeader( 'X-PJAX-FRAME-ID', this.index() );
		//if( oFormData ) {
		//	oXhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
		//}
		const iHashPos = oOpts.sUrl.indexOf( '#' );
		if( iHashPos !== -1 ) {
			oXhr.setRequestHeader( "X-HASH", oOpts.sUrl.substr( iHashPos + 1 ) );
		}
		oXhr.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );
	}

	_saveState( iStateId ) {
		if( !this.iCacheLen ) {
			return;
		}

		if( !this._oCache[ iStateId ] ) {
			this._oCache[ iStateId ] = {
				eContainer: document.createElement( 'div' ),
				sTitle: '',
				oCustomData: {}
			};
		}
		this._oCache[ iStateId ][ 'iLastTime' ] = this._getTime();

		this._rel()
			.child()
			.canEmpty()
			.find( true )
			.forEach( ( oWidget ) => {
			oWidget.detach();
		} );

		this._moveChilds( this.bl(), this._oCache[ iStateId ][ 'eContainer' ] );
		this._oCache[ iStateId ][ 'sTitle' ] = document.title;
		this._oCache[ iStateId ][ 'oCustomData' ] = this.oCustomData;
		this._gcCache();
	}

	hasState( iStateId ) {
		return !!this._oCache[ iStateId ];
	}

	toState( iStateId ) {

		if( iStateId === this._iStateId ) {
			return true;
		}

		const iOldStateId = this._iStateId, iNewStateId = iStateId;
		if( !this.hasState( iNewStateId ) ) {
			return false;
		}

		const oCacheItem = this._oCache[ iNewStateId ];
		this._saveState( iOldStateId );

		// todo подумать еще
		/*if( this._oCache[ iNewStateId ] ) {
			this._oCache[ iNewStateId ][ 'iLastTime' ] = this._getTime();
			console.log( iNewStateId + ' ' + this._oCache[ iNewStateId ][ 'iLastTime' ] );
		}*/
		document.title = oCacheItem.sTitle;
		this._moveChilds( oCacheItem.eContainer, this.bl() );
		this.oCustomData = oCacheItem.oCustomData;
		this.oneStorage()
			.reindex( this.bl() );
		this._rel()
			.child()
			.canEmpty()
			.find( true )
			.forEach( ( oWidget ) => {
				oWidget.attach();
			} );
		//this._link( this.bl() );
		this._iStateId = iNewStateId;
		return true;
	}

	_gcCache() {
		const iCacheLen = Object.keys( this._oCache ).length;
		if( iCacheLen <= this.iCacheLen ) {
			return;
		}
		let aData = [];
		for( let iCacheId in this._oCache ) {
			aData.push( [ this._oCache[ iCacheId ].iLastTime, iCacheId ] );
			//console.log( iCacheId + ' ' + this._oCache[ iCacheId ].iLastTime );
		}
		aData.sort( ( aItemA, aItemB ) => {
			return aItemA[ 0 ] - aItemB[ 0 ]
		} );
	 	aData = aData.slice( 0, iCacheLen - this.iCacheLen );
		for( let i = 0; i < aData.length; i++ ) {
			let iCacheId = aData[ i ][ 1 ];

			this._unlink( this._oCache[ iCacheId ][ 'eContainer' ], false );
			delete this._oCache[ iCacheId ];
		}
	}

	_moveChilds( eOldParent, eNewParent ) {
		while( eOldParent.childNodes.length > 0 ) {
			eNewParent.appendChild( eOldParent.childNodes[0] );
		}
	}

	_prepareOpts( oOptsCustom ) {

		const aKeys = [ 'sUrl', 'bCache', 'oFormData', 'bPost', 'oCustomData', 'bPreload', 'bScroll', 'sContent' ];
		const oOpts = {};
		for( let i = 0; i < aKeys.length; i++ ) {
			let sKey = aKeys[ i ];
			if( oOptsCustom.hasOwnProperty( sKey ) ) {
				oOpts[ sKey ] = oOptsCustom[ sKey ];
			} else if( this.hasOwnProperty( sKey ) ) {
				oOpts[ sKey ] = this[ sKey ];
			} else {
				oOpts[ sKey ] = null;
			}
		}

		if( oOpts.bPost === null ) {
			oOpts.bPost = !!oOpts.oFormData;
		}

		if( typeof oOpts.sUrl !== 'undefined' ) {
			oOpts.sUrl = this._absUrl(  oOpts.sUrl );
		}
		return oOpts;
	}

	_preloadFetch() {
		const sPreloadUrl = this.aPreloadUrls.shift();
		if( !sPreloadUrl ) {
			this._bPreloadNow = false;
			return;
		}
		this._bPreloadNow = true;
		this._fetch( { sUrl: sPreloadUrl }  ).then( ( oResponse ) => {
			this._preloadSave( sPreloadUrl, oResponse );
			this._preloadFetch();
		} );
	}

	_preloadSave( sPreloadUrl, oResponse ) {
		this._oPreloads[ sPreloadUrl ] = oResponse;
	}

	_parseXhr( oXhr ) {
		const oRet = {
			sHtml: '',
			sUrl: oXhr.responseURL || oXhr.url,
			oJson: null
		};
		const sContentType = oXhr.getResponseHeader( 'Content-type' );
		const sResponse = oXhr.responseText;
		if( sContentType && sContentType.indexOf( 'application/json' ) !== -1 ) {
			oRet.oJson = JSON.parse( sResponse );
		} else {
			oRet.sHtml = sResponse;
		}
		return oRet;
	}

	_getTime() {
		// особая история, чтобы на ровном месте тесты сильно быстрые не падали
		let iTime = (new Date).getTime();
		if( iTime <= this._iLastTime ) {
			iTime = this._iLastTime + 1;
		}
		this._iLastTime = iTime;
		return iTime;
	}

	getHistoryState() {
		return this.stateId();
	}

	toHistoryState( iStateId ) {
		return this.toState( iStateId );
	}

	_absUrl( sUrl ) {
		if( sUrl.substr( 0, 4 ) === 'http' ) {
			return sUrl;
		}
		const sOrigin = location.origin;
		if( sUrl.indexOf( sOrigin ) !== 0 ) {
			if( sUrl.substr( 0, 1 ) === '/' ) {
				sUrl = sOrigin + sUrl;
			} else {
				const sPathname = location.pathname;
				const iLastSlashPos = sPathname.lastIndexOf( '/' );
				sUrl = sOrigin + sPathname.substr( 0, iLastSlashPos + 1 ) + sUrl;
			}
		}
		return sUrl;
	}

	getFrameId() {
		if( !this._sFrameId ) {
			this._sFrameId = this._attr( '', 'frame-id' );
		}
		return this._sFrameId;
	}
}
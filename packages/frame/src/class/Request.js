/**
 * @typedef {import('./../interfaces').IRelQuery} IRelQuery
 */

export class Request {

	/**
	 * @type function():IRelQuery
	 */
	newRelQuery;

	cFrame;

	cLayers;

	fnDeepKey;

	optsMap() {
		return {
			'href': 'sUrl',
			'data-url': 'sUrl',
			'data-post': 'b:bPost',
			'data-cache': 'b:bCache',
			'data-confirm': 'sConfirm',
			'data-custom-data': 'js:oCustomData',
			'data-scroll': 'b:bScroll',
			'data-layer': 's:sLayer',
			'data-popup': 's:sLayer', // deprecated
			'target': 'sFrameId',
			'data-target': 'sFrameId',
			'data-frame-id': 'sFrameId',
			'data-resolve-frame-id': 'sResolveFrameId',
		};
	}
	
	exec( oOpts, ...aMethods ) {

		oOpts = this._prepareOpts( oOpts );

		let bResult = true;
		for( let i = 0; i < aMethods.length; i++ ) {
			let sMethod = aMethods[ i ];
			bResult = this[ sMethod ].call( this, oOpts );
			if( !bResult ) {
				break;
			}
		}
		return bResult;
	}

	disabled( oOpts ) {
		if( !oOpts.eBtn ) {
			return true;
		}
		return !oOpts.eBtn.disabled;
	}

	confirm( oOpts ) {
		if( !oOpts.sConfirm ) {
			return true;
		}
		return window.confirm( oOpts.sConfirm );
	}

	urlBlank( oOpts ) {

		if( oOpts.sFrameId === '_blank' ) {
			//window.open( oOpts.sUrl, '_blank' );
			// https://habr.com/post/282880/
			const oBlankWindow = window.open();
			oBlankWindow.opener = null;
			oBlankWindow.location = oOpts.sUrl;
			return false;
		} else if( oOpts.sFrameId === '_top' ) {
			location = oOpts.sUrl;
			return false;
		} else {
			return true;
		}
	}

	layer( oOpts ) {
	
		if( typeof oOpts.bLayer === 'undefined' ) {
			return true;
		}
	
		const oLayersOpts = this.fnDeepKey( [ 'sUrl', 'oFormData', 'bPost', 'oCustomData', 'sFrameId', 'sContent', 'bLayer', 'sLayer', 'eBtn', 'oEvent' ], oOpts );
		const oLayers = this.newRelQuery()
			.from( oOpts.eBtn )
			.parent()
			.typeOf( this.cLayers )
			.find( false );
		if( oOpts.bLayer ) {
			oLayers.show( oLayersOpts );
		} else {
			oLayers.hide( oLayersOpts );
		}
		return false;
	}

	frame( oOpts ) {

		if( !oOpts.sFrameId ) {
			return true;
		}
		const oFrameOpts = this.fnDeepKey( [ 'sUrl', 'oFormData', 'bPost', 'bScroll', 'oCustomData', 'sContent' ], oOpts );

		const oFrame = this.newRelQuery()
			.typeOf( this.cFrame )
			.index( oOpts.sFrameId )
			.find();
		if( oOpts.sResolveFrameId ) {
			oFrame.promise().then( () => {
				this._resolveReload( oOpts.sResolveFrameId );
			} );
		}
		oFrame.update( oFrameOpts );
		return false;
	}

	win( oOpts ) {
		if( oOpts.oFormData && oOpts.eForm ) {
			oOpts.eForm.submit();
		} else {
			location = oOpts.sUrl;
		}
	}

	_prepareOpts( oOpts ) {
		if( oOpts.sUrl && oOpts.sUrl.substr( 0, 1 ) === '/' ) {
			oOpts.sUrl = location.protocol + '//' + location.host + oOpts.sUrl;
		}
		if( typeof oOpts.sLayer !== 'undefined' ) {
			if ( parseInt( oOpts.sLayer ) + '' === oOpts.sLayer ) {
				oOpts.bLayer = !!parseInt( oOpts.sLayer );
				oOpts.sLayer = 'Layer';
			} else {
				oOpts.bLayer = true;
			}
		}
		return oOpts;
	}

	_resolveReload( sFrameId ) {
		const oFrame = this.newRelQuery()
			.index( sFrameId )
			.typeOf( this.cFrame )
			.find();
		return oFrame.reload();
	}
}
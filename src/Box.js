export class Box{

	/**
	 * кеш по синглетонам
	 * @type {{}}
	 */

	_oOne;

	_oRootBox;

	constructor( oBox = null ) {
		this._autoBind();
		this._oOne = new WeakMap();
		this._oRootBox = oBox ? oBox.root() : this;
	}

	/**
	 * метод по функции создания нового объекта, создает его и кеширует
	 * @param {function} fnNew
	 * @return {object}
	 */
	one( fnNew ) {
		if( this._oOne.has( fnNew ) ) {
			return this._oOne.get( fnNew );
		} else {
			const oObj = fnNew.call( this );
			this._oOne.set( fnNew, oObj );
			return oObj;
		}
	}

	/**
	 * загрузка внешнего скрипта
	 * @param {string} sUrl
	 * @param {function} fnResolve callback функция успешной загрузки, если указан, не будет использоваться Promise
	 * @param {function} fnReject callback функция ошибки
	 * @return {Promise<any>}
	 */
	importExt( sUrl, fnResolve, fnReject ) {
		const hExecutor = ( hResolve, hReject ) => {
			const eScript = document.createElement( "script" );
			eScript.src = sUrl;
			eScript.type = 'text/javascript';
			eScript.onload = hResolve;
			eScript.onerror = () => {
				hReject( "error script load " + sUrl );
			};
			eScript.async = true;
			document.body.appendChild( eScript );
		};
		if( fnResolve ) {
			hExecutor( fnResolve, fnReject );
		} else {
			return new Promise( hExecutor );
		}
	}

	root() {
		return this._oRootBox;
	}

	/**
	 * автоустановка this контекста во все методы объекта
	 * для методов new*, проверяет чтобы ни одно публичное свойство не содержало undefined
	 */
	_autoBind() {
		let oObj = this;
		do {
			if( Box === oObj.constructor ) {
				break;
			}
			const aProps = Object.getOwnPropertyNames( oObj );
			for( let i = 0; i < aProps.length; i++ ) {
				let sPropName = aProps[ i ];
				if( typeof this[ sPropName ] !== 'function' || sPropName === 'constructor' ) {
					continue;
				}
				this[ sPropName ] = this._bind( this[ sPropName ], sPropName.indexOf( 'new' ) === 0 );
			}
		} while ( ( oObj = Object.getPrototypeOf( oObj ) ) );
	}

	/**
	 * привязка к методу контекста this
	 * @param {function} fnMethod
	 * @param {boolean} bWithAssert true означает с результатом выполнить еще _assertUndefProps
	 * @return {function}
	 */
	_bind( fnMethod, bWithAssert ) {
		if( bWithAssert ) {
			return ( ...aArgs ) => {
				const oNewObj = fnMethod.call( this, ...aArgs );
				this._assertUndefProps( oNewObj );
				return oNewObj;
			};
		} else {
			return fnMethod.bind( this );
		}
	}

	/**
	 * пройтись по публичным свойствам объекта, Error если хоть один undefined
	 * @param oObj
	 */
	_assertUndefProps( oObj ) {
		for( let sProp in oObj ) {
			if( sProp.substring( 0, 1 ) === '_' ) {
				continue;
			}
			if( typeof oObj[ sProp ] !== 'undefined' ) {
				continue;
			}
			throw new Error( 'required ' + oObj.constructor.name + '.' + sProp + ' is undefined' );
		}
	}
}
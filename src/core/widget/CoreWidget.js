/**
 * виджет
 * @implements IWidget
 */
export class CoreWidget {
	__eBl;
	__sId;
	__sIndex;

	fnOneLinker;
	fnOneAttrs;
	fnOneEl;

	constructor( eBlock, sBlockId ) {
		this.__eBl = eBlock;
		this.__sId = sBlockId;
	}

	run() {

	}

	bl() {
		return this.__eBl;
	}

	blockId() {
		return this.__sId;
	}

	/**
	 * поиск элемента виджета
	 * @param {string} mQuery
	 * @return {Element|Element[]}
	 */
	_el( mQuery ) {
		if ( mQuery === '' ) {
			return this.bl();
		}
		return this.fnOneEl()
			.find( this, mQuery );
	}

	/**
	 * выборка других виджетов
	 * @param {boolean} bFromThis
	 * @return {IRelQuery}
	 */
	rel( bFromThis = true ) {
		const oQuery = this.fnOneLinker()
			.oneStorage()
			.query();
		if ( bFromThis ) {
			oQuery.from( this.bl() );
		}
		return oQuery;
	}

	/**
	 * @param {string|Element|Element[]} mContext
	 * @param {string} sEvent
	 * @param {function} fnHandler
	 */
	_on( mContext, sEvent, fnHandler ) {
		this._context( mContext ).forEach( ( eContext ) => {
			eContext.addEventListener( sEvent, fnHandler );
		} );
	}

	/**
	 * @param {string|Element|Element[]} mContext
	 * @param {string} sEvent
	 * @param {function} fnHandler
	 */
	_off( mContext, sEvent, fnHandler ) {
		this._context( mContext ).forEach( ( eContext ) => {
			eContext.removeEventListener( sEvent, fnHandler );
		} );
	}

	_fire( mContext, sEvent, oData ) {
		const oEvent = new CustomEvent( sEvent, {detail: oData || {}} );
		this._context( mContext ).forEach( ( eContext ) => {
			eContext.dispatchEvent( oEvent );
		} );
	};

	_fireNative( mContext, sEvent, bBubbles = false ) {
		const oEvent = document.createEvent( 'HTMLEvents' );
		oEvent.initEvent( sEvent, bBubbles, false );
		this._context( mContext ).forEach( ( eContext ) => {
			eContext.dispatchEvent( oEvent );
		} );
	};

	_mod( mContext, mMod, mValue ) {
		this._context( mContext ).forEach( ( eContext ) => {
			switch ( typeof mMod ) {
				case 'object':
					if ( Array.isArray( mMod ) ) {
						for ( let i = 0; i < mMod.length; i++ ) {
							eContext.classList.toggle( mMod[i], mMod[i] === mValue );
						}
					} else {
						for ( let sModNick in mMod ) {
							eContext.classList.toggle( mMod[sModNick], sModNick === mValue );
						}
					}
					break;
				case 'string':
					eContext.classList.toggle( mMod, mValue );
					break;
			}
		} );
	}

	/**
	 * @param mContext
	 * @param {string} sAttr
	 * @param {string|null} sAttrPrefix
	 */
	_attr( mContext, sAttr, sAttrPrefix = null ) {
		const oAttrs = this._attrs( mContext, [sAttr], sAttrPrefix );
		const aVals = Object.values( oAttrs );
		return aVals.length ? aVals[0] : null;
	}

	/**
	 * @param mContext
	 * @param {array[]|string[]|object} mMap
	 * @param {string|null} sAttrPrefix
	 */
	_attrs( mContext, mMap, sAttrPrefix = null ) {
		const aElements = this._context( mContext );
		return this.fnOneAttrs()
			.parse( aElements, mMap, sAttrPrefix );
	}

	/**
	 * i: _toInt,
	 * b: _toBool,
	 * f: _toFloat,
	 * mod: _toMod,
	 * js: _toJson,
	 * as: _toArrayOfString
	 * @param {array|object} mMap
	 */
	_my( mMap ) {
		const oAttrs = this._attrs( '', mMap );
		for ( let sAttr in oAttrs ) {
			this[sAttr] = oAttrs[sAttr];
		}
	}

	_link( mContext, bWithSelf ) {
		const aPromises = [];
		this._context( mContext ).forEach( ( eContext ) => {
			aPromises.push( this.fnOneLinker().link( eContext, bWithSelf ) );
		} );
		return Promise.all( aPromises );
	}

	_unlink( mContext, bWithSelf ) {
		this._context( mContext ).forEach( ( eContext ) => {
			this.fnOneLinker().unlink( eContext, bWithSelf );
		} );
	}

	_import( sImportName ) {
		const fnImport = this.fnOneLinker().getImport( sImportName, this.blockId() );
		if ( !fnImport ) {
			throw new Error( 'not setted import "' + sImportName + '"' );
		}
		return fnImport();
	}

	/**
	 * @param {string|string[]|Element|Element[]} mContext
	 * @return {Element[]}
	 * @private
	 */
	_context( mContext ) {
		let aRet = [];
		if ( typeof mContext === 'string' ) {
			mContext = this._el( mContext );
		}
		if ( Array.prototype.isPrototypeOf( mContext ) || NodeList.prototype.isPrototypeOf( mContext ) ) {
			for ( let i = 0; i < mContext.length; i++ ) {
				this._context( mContext[i] ).forEach( ( eElement ) => {
					aRet.push( eElement );
				} )
			}
		} else if ( mContext ) {
			aRet.push( mContext );
		}
		return aRet;
	}

	/**
	 * сброс кеша с найдеными элементами
	 */
	_elReset() {
		this.fnOneEl().resetCache( this );
	}

	index() {
		if ( typeof this.__sIndex === 'undefined' ) {
			this.__sIndex = this._getIndex();
		}
		return this.__sIndex;
	}

	_getIndex() {
		return null;
	}

	destructor() {
	}
}
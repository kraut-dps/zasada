/**
 * виджет
 * @implements IWidget
 */
export class CoreWidget{
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

	destructor() {
	}

	index() {
		if( typeof this.__sIndex === 'undefined' ) {
			this.__sIndex = this._getIndex();
		}
		return this.__sIndex;
	}

	run(){
	
	}
	
	_getIndex() {
		return null;
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
		if( mQuery === '' ) {
			return this.bl();
		}
		return this.fnOneEl()
			.find( this, mQuery );
	}

	/**
	 * сброс кеша с найдеными элементами
	 */
	_elReset() {
		this.fnOneEl()
			.resetCache( this );
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
		if( bFromThis ) {
			oQuery.from( this.bl() );
		}
		return oQuery;
	}

	/**
	 * @param sEvent
	 * @param hHandler
	 */
	//on( sEvent, hHandler ) {
	//	this._on( this.bl(), sEvent, hHandler );
	//}

	/**
	 * @param {String|Element|Element[]} mContext
	 * @param sEvent
	 * @param hHandler
	 * @param {boolean} bOff
	 */
	_on( mContext, sEvent, hHandler, bOff = false ) {
		this._forEachElement(
			mContext,
			( eContext ) => {
				eContext.addEventListener( sEvent, hHandler );
			}
		);
	}

	/**
	 * @param sEvent
	 * @param hHandler
	 */
	//off( sEvent, hHandler ) {
	//	this._off( this.bl(), sEvent, hHandler );
	//}

	/**
	 * @param {String|Element|Element[]} mContext
	 * @param sEvent
	 * @param hHandler
	 */
	_off( mContext, sEvent, hHandler ) {
		this._forEachElement(
			mContext,
			( eContext ) => {
				eContext.removeEventListener( sEvent, hHandler );
			}
		);
	}

	_fire( mContext, sEvent, oData ) {
		const oEvent = new CustomEvent( sEvent, { detail: oData || {} } );
		this._forEachElement(
			mContext,
			( eContext ) => {
				eContext.dispatchEvent( oEvent );
			}
		);
	};

	_fireNative( mContext, sEvent, bBubbles = false ) {
		const oEvent = document.createEvent( 'HTMLEvents' );
		oEvent.initEvent( sEvent, bBubbles, false );
		this._forEachElement(
			mContext,
			( eContext ) => {
				eContext.dispatchEvent( oEvent );
			}
		);
	};

	_mod( mContext, mMod, mValue ) {
		this._forEachElement(
			mContext,
			( eContext ) => {
				switch( typeof mMod ) {
					case 'object':
						if( Array.isArray( mMod ) ) {
							for( let i = 0; i < mMod.length; i++ ) {
								eContext.classList.toggle( mMod[ i ], mMod[ i ] === mValue );
							}
						} else {
							for( let sModNick in mMod ) {
								eContext.classList.toggle( mMod[sModNick], sModNick === mValue );
							}
						}
						break;
					case 'string':
						eContext.classList.toggle( mMod, mValue );
						break;
				}
			}
		);
	}

	/**
	 * @param {array[]|string[]|object} mMap
	 * @param {Element[]} aContexts
	 * @param {string|null} sAttrPrefix
	 */
	_attr( mMap, aContexts = null, sAttrPrefix = null ) {
		if( aContexts === null ) {
			aContexts = [ this.bl() ];
		}
		return this.fnOneAttrs()
			.parse( aContexts, mMap, sAttrPrefix );
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
	_attrProp( mMap ) {
		const oAttrs = this._attr( mMap );
		for( let sAttr in oAttrs ) {
			this[ sAttr ] = oAttrs[ sAttr ];
		}
	}

	_link( mContext, bWithSelf ) {
		const aPromises = this._forEachElement(
			mContext,
			( eContext ) => {
				return this.fnOneLinker().link( eContext, bWithSelf );
			}
		);
		return Promise.all( aPromises );
	}

	_unlink( mContext, bWithSelf ) {
		this._forEachElement(
			mContext,
			( eContext ) => {
				this.fnOneLinker().unlink( eContext, bWithSelf );
			}
		);
	}

	_import( sImportName ) {
		const fnImport = this.fnOneLinker().getImport( sImportName, this.blockId() );
		if( !fnImport ) {
			throw new Error( 'not setted import "' + sImportName + '"' );
		}
		return fnImport();
	}

	_forEachElement( mContext, hHandler ) {
		let aRet = [];
		if( typeof mContext === 'string' ) {
			mContext = this._el( mContext );
		}
		if ( Array.prototype.isPrototypeOf( mContext ) || NodeList.prototype.isPrototypeOf( mContext ) ) {
			for ( let i = 0; i < mContext.length; i++ ) {
				aRet.push( hHandler.call( this, mContext[ i ] ) );
			}
		} else if( mContext ) {
			aRet.push( hHandler.call( this, mContext ) );
		}
		return aRet;
	}
}
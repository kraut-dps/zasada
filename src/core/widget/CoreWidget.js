/**
 * виджет
 * @implements IWidget
 */
export class CoreWidget {
	__eBl;
	__sId;
	__sIdx;

	oneLinker;
	oneAttrs;

	/**
	 * @type {function(): IEl}
	 */
	oneEl;

	/**
	 * @param {Element} eBlock DOM элемент основного узла виджета
	 * @param {string} sBlockId строковый инедтификатор типа виджета
	 */
	constructor( eBlock, sBlockId ) {
		this.__eBl = eBlock;
		this.__sId = sBlockId;
	}

	run() {

	}

	/**
	 * DOM элемент основного узла виджета
	 * @return {Element}
	 */
	bl() {
		return this.__eBl;
	}

	/**
	 * строковый идентификатор типа виджета
	 * @return {string}
	 */
	blockId() {
		return this.__sId;
	}

	/**
	 * поиск элемента виджета
	 * @param {string|IElQuery} mQuery
	 * @return {Element|Element[]}
	 */
	_el( mQuery ) {
		if ( mQuery === '' ) {
			return this.bl();
		}
		return this.oneEl()
			.find( this, mQuery );
	}

	/**
	 * выборка других виджетов
	 * @example
	 * .rel().children().typeOf( WidgetClass ).find()
	 * @example
	 * .rel().parents().typeOf( WidgetClass ).find()
	 * @example
	 * .rel().index( 'index' ).find()
	 * @param {boolean} bFromThis
	 * @return {IRelQuery}
	 */
	rel( bFromThis = true ) {
		const oQuery = this.oneLinker()
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

	/**
	 * fire CustomEvent
	 * @param {string|Element|Element[]} mContext
	 * @param {string} sEvent название события
	 * @param {any} mData данные события
	 */
	_fire( mContext, sEvent, mData ) {
		const oEvent = new CustomEvent( sEvent, {detail: mData} );
		this._context( mContext ).forEach( ( eContext ) => {
			eContext.dispatchEvent( oEvent );
		} );
	};

	/**
	 * изменить css класс
	 * @example
	 * ._mod( '', 'new_class', true )
	 *
	 * @example
	 * ._mod( '', [ 'new_class1', 'new_class2' ], 'new_class1' )
	 *
	 * @example
	 * ._mod( '', { one: 'new_class1', two: 'new_class2' ], 'one' )
	 * 
	 * @param {string|Element|Element[]} mContext
	 * @param {string|array|object} mMod
	 * @param {bool|string} mValue
	 */
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
		for( let sKey in oAttrs ) {
			return oAttrs[ sKey ];
		}
		return null;
	}

	/**
	 * @param mContext
	 * @param {array[]|string[]|object} mMap
	 * @param {string|null} sAttrPrefix
	 */
	_attrs( mContext, mMap, sAttrPrefix = null ) {
		const aElements = this._context( mContext );
		return this.oneAttrs()
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
			aPromises.push( this.oneLinker().link( eContext, bWithSelf ) );
		} );
		return Promise.all( aPromises );
	}

	_unlink( mContext, bWithSelf ) {
		this._context( mContext ).forEach( ( eContext ) => {
			this.oneLinker().unlink( eContext, bWithSelf );
		} );
	}

	_import( sImportName ) {
		const fnImport = this.oneLinker().getImport( sImportName, this.blockId() );
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
		this.oneEl().resetCache( this );
	}

	index() {
		if ( typeof this.__sIdx === 'undefined' ) {
			this.__sIdx = this._getIndex();
		}
		return this.__sIdx;
	}

	_getIndex() {
		return null;
	}

	destructor() {
	}
}
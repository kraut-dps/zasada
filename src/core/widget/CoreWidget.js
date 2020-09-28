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
	 * @type {function( oError: object ): IError}
	 */
	newError;

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
	 * .rel().child().typeOf( WidgetClass ).find()
	 *
	 * @example
	 * .rel().parent().typeOf( WidgetClass ).find()
	 *
	 * @example
	 * .rel().index( 'index' ).find()
	 *
	 * @example
	 * .rel().typeOf( WidgetClass ).onAdd( fnHandler: ( IWidget, sEvent, IRelQuery ) )
	 *
	 * @param {string|Element|Element[]} mContext
	 * @return {IRelQuery}
	 */
	rel( mContext = '' ) {
		return this.oneLinker()
			.newRelQuery()
			.widget( this )
			.from( this._context( mContext )[0] )
	}

	/**
	 * @param {string|Element|Element[]} mContext
	 * @param {string} sEvent
	 * @param {function} fnHandler
	 */
	_on( mContext, sEvent, fnHandler ) {
		this._context( mContext ).forEach( ( eContext ) => {
			eContext.addEventListener( sEvent, this._wrapError( fnHandler ) );
		} );
	}

	/**
	 * @param {string|Element|Element[]} mContext
	 * @param {string} sEvent
	 * @param {function} fnHandler
	 */
	_off( mContext, sEvent, fnHandler ) {
		this._context( mContext ).forEach( ( eContext ) => {
			eContext.removeEventListener( sEvent, this._wrapError( fnHandler ) );
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
	 * получить значение DOM Element атрибута
	 *
	 * @example
	 * ._attr( '', 'var' )
	 *
	 * @example
	 * ._attr( '', 'i:var' ) // with integer cast i - int, b - bool, ... {@link Attrs.oCasts}
	 *
	 * @param {string|Element|Element[]} mContext
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
	 * получить значения DOM Element атрибутов
	 *
	 * @example
	 * ._attrs( '', { key1: 'i:attr1', key2: 'b:attr2' } ) // cast i - int, b - bool, ... {@link Attrs.oCasts}
	 *
	 * @param {string|Element|Element[]} mContext
	 * @param {array[]|string[]|object} mMap
	 * @param {string|null} sAttrPrefix
	 */
	_attrs( mContext, mMap, sAttrPrefix = null ) {
		const aElements = this._context( mContext );
		return this.oneAttrs()
			.parse( aElements, mMap, sAttrPrefix );
	}

	/**
	 * получить значения DOM Element атрибутов и поместить их в свойства виджета
	 *
	 * @example
	 * ._my( { prop1: 'i:attr1', prop2: 'b:attr2' } ) // cast i - int, b - bool, ... {@link Attrs.oCasts}
	 * @param {array|object} mMap
	 */
	_my( mMap ) {
		const oAttrs = this._attrs( '', mMap );
		for ( let sAttr in oAttrs ) {
			this[sAttr] = oAttrs[sAttr];
		}
	}

	/**
	 * запустить привязку виджетов к контексту
	 * @param {string|Element|Element[]} mContext
	 * @param {boolean} bWithSelf включая DOM элемент контекста?
	 * @return {Promise<any[]>}
	 */
	_link( mContext, bWithSelf ) {
		const aPromises = [];
		this._context( mContext ).forEach( ( eContext ) => {
			aPromises.push( this.oneLinker().link( eContext, bWithSelf ) );
		} );
		return Promise.all( aPromises );
	}

	/**
	 * отвязать виджеты от контекста
	 * @param {string|Element|Element[]} mContext
	 * @param {boolean} bWithSelf включая DOM элемент контекста?
	 */
	_unlink( mContext, bWithSelf ) {
		this._context( mContext ).forEach( ( eContext ) => {
			this.oneLinker().unlink( eContext, bWithSelf );
		} );
	}

	/**
	 * обертка Element.innerHTML и Element.insertAdjacentHTML для динамического изменения HTML
	 * @param {string|Element|Element[]} mContext
	 * @param {string} sHtml
	 * @param {null|string} sInsertPosition beforebegin | afterbegin | beforeend | afterend for Element.insertAdjacentHTML
	 * @return {Promise<any[]>}
	 */
	_html( mContext, sHtml, sInsertPosition = null ) {
		const aPromises = [];

		this._context( mContext ).forEach( ( eContext ) => {

			if( !sInsertPosition ) {
				// самый простой вариант, заменяем innerHTML
				this._unlink( eContext, false );
				eContext.innerHTML = sHtml;
				let pPromise = this._link( eContext, false );
				aPromises.push( pPromise );
				return;
			}

			// специальная метка, чтобы разобраться, какой новый узел, а какой старый
			// после вставки, проходимся по всем новым узлам, выполняем по ним _link
			// доходим до метки, удаляем ее и останавливаемся
			let bBefore = sInsertPosition === 'beforebegin' || sInsertPosition === 'beforeend';
			const sMarkComment = '__mark__';
			const sMarkHtml = '<!--' + sMarkComment + '-->';
			const sHtmlWithMark = ( bBefore ? sMarkHtml : '' ) + sHtml + ( !bBefore ? sMarkHtml : '' );

			eContext.insertAdjacentHTML( sInsertPosition, sHtmlWithMark );
			let eContextItem;
			const fnNext = ( eContextItem ) => {
				return bBefore ? eContextItem.previousSibling : eContextItem.nextSibling;
			}
			switch( sInsertPosition ) {
				case 'afterbegin':
					eContextItem = eContext.firstChild;
					break;
				case 'beforeend':
					eContextItem = eContext.lastChild;
					break;
				default:
					eContextItem = fnNext( eContext );
			}

			do {
				if( eContextItem.nodeType === 1 ) {
					// DOM Element link
					aPromises.push( this._link( eContextItem, true ) );
				} else if( eContextItem.nodeType === 8 && eContextItem.textContent.trim() === sMarkComment ) {
					// DOM comment with mark remove
					eContextItem.parentNode.removeChild( eContextItem );
					break;
				}
			} while ( ( eContextItem = fnNext( eContextItem ) ) )
		} );
		return Promise.all( aPromises );
	}

	/**
	 * достать promise с импортом из глобального хранилища
	 * @param {string} sImportName
	 * @return {Promise<any[]>}
	 */
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

	/**
	 * возможность обернуть обработчик, чтобы обогатить Error, добавить в него объект виджета
	 * @param {function} fnHandler
	 * @return {function}
	 */
	_wrapError( fnHandler ) {
		/*if( !fnHandler._tryCatch) {
			const oWidget = this;
			fnHandler._tryCatch = function () {
				try {
					return fnHandler.apply( this, arguments );
				} catch ( e ) {
					throw oWidget.newError( { mOrigin: e, oWidget } );
				}
			};
		}
		return fnHandler._tryCatch;*/
		if( !this._oWrapHandlers ) {
			this._oWrapHandlers = new WeakMap();
		}
		let fnHandlerWrapped = this._oWrapHandlers.get( fnHandler );
		if( !fnHandlerWrapped ) {
			const oWidget = this;
			fnHandlerWrapped = function( ...aArgs ) {
				try {
					return fnHandler( ...aArgs );
				} catch ( e ) {
					throw oWidget.newError( { mOrigin: e, oWidget } );
				}
			};
			this._oWrapHandlers.set( fnHandler, fnHandlerWrapped );
		}
		return fnHandlerWrapped;
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
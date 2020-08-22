/**
 * хранилище виджетов
 * @implements IStorage
 */
export class Storage {

	/**
	 * @type {function(): IDom}
	 */
	oneDom;

	/**
	 * @type {function( function(): Storage ): IRelQuery}
	 */
	newQuery;

	newError;

	/**
	 * @type {WeakMap} eBlock => { sBlockId1: oWidget1, sBlockId2: oWidget2 }
	 */
	_oMap;

	/**
	 * @type {WeakMap} cWidget => [ sBlockId1, sBlockId2, ... ]
	 */
	_oWidgetBlockIds;

	/**
	 * @type {Object} sBlockId: { sIndex => oWidget }
	 */
	_oIndex = {};


	constructor() {
		this._oMap = new WeakMap();
		this._oWidgetBlockIds = new WeakMap();
	}

	/**
	 * добавление виджета
	 * @param {IWidget} oWidget
	 */
	add( oWidget ) {

		this.addBlockIdWidgetClassRel( oWidget.constructor, oWidget.blockId() );

		// добавляем виджет в WeakMap
		const eBlock = oWidget.bl();
		const sBlockId = oWidget.blockId();
		let oWidgets = this._oMap.get( eBlock );
		oWidgets = { ...oWidgets, [ sBlockId ]: oWidget };
		this._oMap.set( eBlock, oWidgets );

		// индексируем
		this._addToIndex( oWidget, sBlockId );
	}

	/**
	 * удаление узла
	 * @param {Element} eContext
	 * @param {boolean} bWithSelf
	 * @returns {array}
	 */
	drop( eContext, bWithSelf ) {

		// найдем элементы DOM
		const aBlocks = this._findBlocks( eContext, 1, bWithSelf ), aWidgets = [];

		let eBlock, oWidgets, i;
		for ( i = 0; i < aBlocks.length; i++ ) {
			eBlock = aBlocks[ i ];

			// удалим из WeakMap
			oWidgets = this._oMap.get( eBlock );
			this._oMap.delete( eBlock );

			// если появится необходимость, добавить в тесты кейс
			// if ( !oWidgets ) {
			// 	continue;
			// }

			for ( let sBlockId in oWidgets ) {
				aWidgets.push( oWidgets[ sBlockId ] );
			}

			this._dropFromIndex( oWidgets );
		}
		return aWidgets;
	}

	/**
	 * @return {IRelQuery}
	 */
	query() {
		return this.newQuery( () => this );
	}

	/**
	 * @param {IRelQuery} oRelQuery
	 * @return {IWidget[]}
	 */
	find( oRelQuery ) {

		let {
			eFrom,
			bWithFrom,
			iWay,
			bOnlyFirst,
			cTypeOf,
			aBlockIds,
			aIndex,
			sCssSel
		} = oRelQuery;

		if ( aBlockIds === null ) {
			aBlockIds = this._getBlockIdsByWidgetClass( cTypeOf );
		}

		if ( aIndex.length ) {
			let oWidget, aRet = [];
			for ( let i = 0; i < aIndex.length; i++ ) {
				let sIndex = aIndex[ i ];
				for ( let j = 0; j < aBlockIds.length; j++ ) {
					oWidget = this._getWidgetByIndex( aBlockIds[ j ], sIndex );
					if ( oWidget &&
						this.checkWidget( oWidget, cTypeOf, eFrom, iWay, bWithFrom, [ sIndex ], sCssSel ) ) {
						aRet.push( oWidget );
						if ( bOnlyFirst ) {
							return aRet;
						}
					}
				}
			}
			return this._canEmptyCheck( aRet, oRelQuery );
		} else {

			// ситуация, когда даже в DOM идти не надо, нужен тот же элемент что запросили
			if ( bOnlyFirst && bWithFrom ) {
				let aRet = this._widgetsFromMap( [ eFrom ], aBlockIds, cTypeOf, bOnlyFirst );
				if ( aRet.length ) {
					return aRet;
				}
			}

			let aBlocks = this._findBlocks( eFrom, iWay, bWithFrom, aBlockIds, sCssSel );
			return this._canEmptyCheck( this._widgetsFromMap( aBlocks, aBlockIds, cTypeOf, bOnlyFirst ), oRelQuery );
		}
	}

	_canEmptyCheck( aRet, oRelQuery ) {
		if( !oRelQuery.bCanEmpty && !aRet.length ) {
			throw this.newError( 'Empty relation result', 'rel-empty' );
		}
		return aRet;
	}

	reindex( eContext, bWithSelf = false ) {
		const aBlocks = this._findBlocks( eContext, 1, bWithSelf );
		for ( let i = 0; i < aBlocks.length; i++ ) {
			let oWidgets = this._oMap.get( aBlocks[ i ] );
			for ( let sBlockId in oWidgets ) {
				this._addToIndex( oWidgets[ sBlockId ], sBlockId );
			}
		}
	}

	_widgetsFromMap( aBlocks, aBlockIds, cWidget, bOnlyFirst ) {
		let oWidgets, sBlockId, aRet = [];
		for ( let i = 0; i < aBlocks.length; i++ ) {
			oWidgets = this._oMap.get( aBlocks[ i ] );
			if( !oWidgets ) {
				continue;
			}
			for ( let j = 0; j < aBlockIds.length; j++ ) {
				sBlockId = aBlockIds[ j ];
				if( cWidget && oWidgets[ sBlockId ] instanceof cWidget || !cWidget ) {
					aRet.push( oWidgets[ sBlockId ] );
					if ( bOnlyFirst ) {
						return aRet;
					}
				}
			}
		}
		return aRet;
	}

	/**
	 * непосредственно метод поиска элементов в DOM
	 * @param {Element} eContext откуда начинаем
	 * @param {int} iDir направление
	 * @param {boolean} bWithSelf захватываем eContext в выборку?
	 * @param {string[]} aBlockIds массив названий виджетов
	 * @param {string} sSelector дополнительный фильтрующий селектор
	 * @return {Element[]}
	 * @private
	 */
	_findBlocks( eContext, iDir, bWithSelf, aBlockIds = [], sSelector = '' ) {
		const oDom = this.oneDom();

		// соберем все нужные css селекторы в одну строку
		let aMatches, aSel = [];
		if ( !aBlockIds.length ) {
			aSel.push( oDom.sel() );
		} else {
			for ( let i = 0; i < aBlockIds.length; i++ ) {
				aSel.push( oDom.sel( aBlockIds[ i ] ) );
			}
		}
		const sSel = aSel.join( ',' );

		// в зависимости от направления поищем элементы
		switch ( iDir ) {
			case -1:
				aMatches = oDom.parents( eContext, sSel, bWithSelf, false );
				break;
			case 1:
				aMatches = oDom.children( eContext, sSel, bWithSelf, false );
				break;
			case 0:
			default:
				aMatches = oDom.children( document.body, sSel, false, false );
				if ( !bWithSelf ) {
					aMatches = aMatches.filter( ( eMatch ) => {
						return eMatch !== eContext;
					} );
				}
				break;
		}

		// если указан еще дополнительный ограничительный селектор, выборку через него пропустим
		if ( sSelector ) {
			aMatches = aMatches.filter( ( eContext ) => {
				return eContext.matches( sSelector )
			} );
		}

		return aMatches;
	}

	_addToIndex( oWidget, sBlockId ) {
		const sIndex = oWidget.index();
		if ( !sIndex ) {
			return;
		}
		this._oIndex[ sBlockId ] = {
			...{},
			...this._oIndex[ sBlockId ],
			[ sIndex ]: oWidget
		};
	}

	_dropFromIndex( oWidgets ) {
		for ( let sBlockId in oWidgets ) {
			const sIndex = oWidgets[ sBlockId ].index();
			if ( this._oIndex[ sBlockId ] ) {
				delete this._oIndex[ sBlockId ][ sIndex ];
			}
		}
	}

	_getWidgetByIndex( sBlockId, sIndex ) {
		if ( this._oIndex[ sBlockId ] && this._oIndex[ sBlockId ][ sIndex ] ) {
			return this._oIndex[ sBlockId ][ sIndex ];
		}
		return null;
	}

	checkWidget( oWidget, cWidget, eContext, iWay, bWithSelf, aIndex, sSelector ) {
		// если понадобится, можно добавить
		//if ( cWidget && !oWidget instanceof cWidget ) {
		//	return false;
		//}
		//if ( aIndex.length && ( !oWidget.index() || aIndex.indexOf( oWidget.index() ) === -1 ) ) {
		//	return false;
		//}
		const eBlock = oWidget.bl();
		if ( sSelector && !eBlock.matches( sSelector ) ) {
			return false;
		}

		if ( bWithSelf && eBlock === eContext ) {
			return true;
		}
		switch ( iWay ) {
			case -1:
				return eBlock.contains( eContext );
			case 1:
				return eContext.contains( eBlock );
			case 0:
			default:
				return true;
		}
	}

	/**
	 * достать из хранилища все blockId привязаные к классу виджета
	 * @param cWidget
	 * @returns {String[]}
	 */
	_getBlockIdsByWidgetClass( cWidget ) {
		cWidget = cWidget || Object;
		let aBlockIds = this._oWidgetBlockIds.get( cWidget );
		if ( !aBlockIds ) {
			aBlockIds = [];
		}
		return aBlockIds;
	}

	/**
	 * добавить в хранилище привязку класса виджета и blockId
	 * @param cWidget
	 * @param sBlockId
	 */
	addBlockIdWidgetClassRel( cWidget, sBlockId ) {
		const aBlockIds = this._getBlockIdsByWidgetClass( cWidget );
		if ( aBlockIds.indexOf( sBlockId ) !== -1 ) {
			return;
		}
		aBlockIds.push( sBlockId );
		this._oWidgetBlockIds.set( cWidget, aBlockIds );
		const oPrototype = Object.getPrototypeOf( cWidget );
		if( oPrototype === Object.getPrototypeOf( Object ) ) {
			this._oWidgetBlockIds.set( Object, aBlockIds );
			return;
		}
		this.addBlockIdWidgetClassRel( oPrototype, sBlockId );
	}
}
/**
 * поиск элементов
 * @implements IEl
 */
export class El{

	/**
	 * @type {function( string ): IElQuery}
	 */
	newElQuery;

	/**
	 * @type {function(): IDom}
	 */
	oneDom;

	/**
	 * кеш запросов
	 * @type {Object.<string, IElQuery>}
	 */
	_oQueries = {};

	/**
	 * кеш элементов
	 * @type {WeakMap}
	 */
	_oElements;

	constructor() {
		this._oElements = new WeakMap();
	}

	/**
	 * поиск элементов в виджете
	 * @param {IWidget} oWidget
	 * @param {string|IElQuery} mQuery
	 * @return {null|Element|Element[]}
	 */
	find( oWidget, mQuery ) {

		const oElQuery = typeof mQuery === 'string' ? this.parse( mQuery ) : mQuery;

		let aElements;
		if( ( aElements = this._findInCache( oWidget, oElQuery ) ) === false ) {
			aElements = this._findEl( oWidget, oElQuery );

			// сохраняем в кеше
			if( !oElQuery.bNoCache ) {
				this._oElements.set( oWidget.bl(), { ...{}, ...this._oElements.get( oWidget.bl() ), [oElQuery.key()]: aElements } );
			}
		}

		if( aElements.length === 0 ) {
			if( !oElQuery.bCanEmpty ) {
				throw new Error( "find required '" + mQuery + "' not found" );
			} else {
				return oElQuery.bOnlyFirst ? null : [];
			}
		} else {
			return oElQuery.bOnlyFirst ? aElements[ 0 ] : aElements;
		}
	}
	resetCache( oWidget ) {
		this._oElements.set( oWidget.bl(), {} );
	}

	parse( sEl ) {

		if( sEl in this._oQueries ) {
			return this._oQueries[ sEl ];
		}

		this._oQueries[ sEl ] = this.newElQuery( sEl );
		return this._oQueries[ sEl ];
	}

	_findInCache( oWidget, oElQuery ) {

		if( oElQuery.bNoCache ) {
			return false;
		}

		const oCache = this._oElements.get( oWidget.bl() ) || {};

		const sKey = oElQuery.key();

		if ( sKey in oCache ) {
			return oCache[ sKey ];
		} else if ( oElQuery.bOnlyFirst ) {

			let oElQueryAll = this._clone( oElQuery );
			oElQueryAll.bOnlyFirst = false;

			const sKeyAll = oElQueryAll.key();
			if ( sKeyAll in oCache ) {
				return [ oCache[ sKeyAll ][ 0 ] ];
			}
		}
		return false;
	}

	_findEl( oWidget, oElQuery ) {
		const oDom = this.oneDom();
		const sSelector = oDom.sel( oWidget.blockId(), oElQuery.sId );
		return oDom.children(
			oWidget.bl(),
			sSelector,
			oElQuery.bWithFrom,
			oElQuery.bOnlyFirst
		);
	}

	_clone( oObj ) {
		return Object.assign( Object.create( Object.getPrototypeOf( oObj ) ), oObj );
	}
}
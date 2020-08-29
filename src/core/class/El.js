/**
 * поиск элементов
 * @implements IEl
 */
export class El{

	/**
	 * @type {function( sQuery: string ): IElQuery}
	 */
	newElQuery;

	/**
	 * @type {function( oError: object ): IError}
	 */
	newError;

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
	_oEls;

	constructor() {
		this._oEls = new WeakMap();
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
				this._oEls.set( oWidget.bl(), { ...{}, ...this._oEls.get( oWidget.bl() ), [oElQuery.key()]: aElements } );
			}
		}

		if( aElements.length === 0 ) {
			if( !oElQuery.bCanEmpty ) {
				throw this.newError( { message: 'Element "_' + oWidget.blockId() + '-' + mQuery + '" not found', sHelp: 'element-not-found' } );
			} else {
				return oElQuery.bOnlyFirst ? null : [];
			}
		} else {
			return oElQuery.bOnlyFirst ? aElements[ 0 ] : aElements;
		}
	}
	resetCache( oWidget ) {
		this._oEls.set( oWidget.bl(), {} );
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

		const oCache = this._oEls.get( oWidget.bl() ) || {};

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
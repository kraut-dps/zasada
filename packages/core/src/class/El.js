/**
 * @typedef {import('./../interfaces').IElInit} IElInit
 * @typedef {import('./../interfaces').IElQuery} IElQuery
 * @typedef {import('./../interfaces').IDom} IDom
 * @typedef {import('./../interfaces').IWidget} IWidget
 */
/**
 * поиск элементов
 * @implements IElInit
 */
export class El{

	/**
	 * @type {function( string ):IElQuery}
	 */
	newElQuery;

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
			if( !oElQuery.isNoCache() ) {
				this._oEls.set( oWidget, { ...{}, ...this._oEls.get( oWidget ), [oElQuery.key()]: aElements } );
			}
		}

		if( aElements.length === 0 ) {
			if( !oElQuery.isCanEmpty() ) {
				throw this.newError( { message: 'Element "_' + oWidget.blockId() + '-' + mQuery + '" not found', sHelp: 'element-not-found' } );
			} else {
				return oElQuery.isOnlyFirst() ? null : [];
			}
		} else {
			return oElQuery.isOnlyFirst() ? aElements[ 0 ] : aElements;
		}
	}
	resetCache( oWidget ) {
		this._oEls.set( oWidget, {} );
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

		const oCache = this._oEls.get( oWidget ) || {};

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

	/**
	 *
	 * @param {IWidget} oWidget
	 * @param {IElQuery} oElQuery
	 * @return {Element[]}
	 * @private
	 */
	_findEl( oWidget, oElQuery ) {
		const oDom = this.oneDom();
		const sSelector = oDom.sel( oWidget.blockId(), oElQuery.getId() );
		return oDom.children(
			oWidget.bl(),
			sSelector,
			oElQuery.isWithFrom(),
			oElQuery.isOnlyFirst()
		);
	}

	_clone( oObj ) {
		return Object.assign( Object.create( Object.getPrototypeOf( oObj ) ), oObj );
	}
}
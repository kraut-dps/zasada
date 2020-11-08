import { Box } from "di-box";

/**
 * @typedef {import('./interfaces').IAttrs} IAttrs
 * @typedef {import('./interfaces').IAttrsConstructor} IAttrsConstructor
 * @typedef {import('./interfaces').IDom} IDom
 * @typedef {import('./interfaces').IDomConstructor} IDomConstructor
 * @typedef {import('./interfaces').IEl} IEl
 * @typedef {import('./interfaces').IElConstructor} IElConstructor
 * @typedef {import('./interfaces').IElQuery} IElQuery
 * @typedef {import('./interfaces').IElQueryConstructor} IElQueryConstructor
 * @typedef {import('./interfaces').ILinkerConstructor} ILinkerConstructor
 * @typedef {import('./interfaces').ILinker} ILinker
 * @typedef {import('./interfaces').IRelQuery} IRelQuery
 * @typedef {import('./interfaces').IRelQueryConstructor} IRelQueryConstructor
 * @typedef {import('./interfaces').IStorage} IStorage
 * @typedef {import('./interfaces').IStorageConstructor} IStorageConstructor
 * @typedef {import('./interfaces').IWidget} IWidget
 * @typedef {import('./interfaces').IWidgetConstructor} IWidgetConstructor
 * @typedef {import('./interfaces').ICustomErrorProps} ICustomErrorProps
 * @typedef {import('./interfaces').IPolyfillsConstructor} IPolyfillsConstructor
 */

export class CoreBox extends Box {

	/** @type {IAttrsConstructor} */
	Attrs

	/** @type {IDomConstructor} */
	Dom

	/** @type {IElConstructor} */
	El

	/** @type {IElQueryConstructor} */
	ElQuery;

	/** @type {ILinkerConstructor} */
	Linker;

	/** @type {IPolyfillsConstructor} */
	Polyfills;

	/** @type {IStorageConstructor} */
	Storage;

	/** @type {IRelQueryConstructor} */
	RelQuery;

	deepKey;
	mergeDeep;

	oPolyfills;

	/**
	 * @return {ILinker}
	 */
	oneLinker() {
		return this.one( this.newLinker );
	}
	newLinker () {
		const oLinker = new this.Linker();
		oLinker.newRelQuery = this.newRelQuery;
		oLinker.newWidget = this.baseNewWidget;
		oLinker.newError = this.newError;
		oLinker.oneStorage = this.oneStorage;
		oLinker.oneDom = this.oneDom;
		oLinker.fnMergeDeep = this.mergeDeep;
		oLinker.fnDeepKey = this.deepKey;

		// без bind( this ), будет sProtectedPrefix undefined
		oLinker.fnAssertUndefProps = this.initCheck.bind( this );
		return oLinker;
	}

	/**
	 * @return {IDom}
	 */
	oneDom() {
		return this.one( this.newDom );
	}
	newDom() {
		return new this.Dom();
	}

	/**
	 * @return {IStorage}
	 */
	oneStorage() {
		return this.one( this.newStorage );
	}
	newStorage() {
		const oStorage = new this.Storage();
		oStorage.oneDom = this.oneDom;
		oStorage.newError = this.newError;
		return oStorage;
	}

	/**
	 * @return {IAttrs}
	 */
	oneAttrs() {
		return this.one( this.newAttrs );
	}
	newAttrs() {
		const oAttrs = new this.Attrs();
		oAttrs.newError = this.newError;
		return oAttrs;
	}

	/**
	 * @return {IEl}
	 */
	oneEl() {
		return this.one( this.newEl );
	}
	newEl() {
		const oEl = new this.El();
		oEl.newElQuery = this.newElQuery;
		oEl.newError = this.newError;
		oEl.oneDom = this.oneDom;
		return oEl;
	}

	/**
	 * @param {Element} eElement
	 * @param {string} sBlockId
	 * @param {IWidgetConstructor} cClass
	 * @returns {IWidget}
	 */
	baseNewWidget( eElement, sBlockId, cClass ) {
		const oWidget = new cClass( eElement, sBlockId );
		oWidget.oneLinker = this.oneLinker;
		oWidget.oneAttrs = this.oneAttrs;
		oWidget.oneEl = this.oneEl;
		oWidget.newError = this.newError;
		return oWidget;
	}

	/**
	 * @return {IRelQuery}
	 */
	newRelQuery() {
		const oRelQuery = new this.RelQuery();
		oRelQuery.oneStorage = this.oneStorage;
		return oRelQuery;
	};

	/**
	 * @param sEl
	 * @return {IElQuery}
	 */
	newElQuery( sEl ) {
		const oElQuery = new this.ElQuery( sEl );
		oElQuery.newError = this.newError;
		return oElQuery;
	}

	/**
	 * @param {ICustomErrorProps} oError
	 * @return ICustomErrorProps
	 */
	newError( oError ) {
		return oError;
	}

	/**
	 * @param {function( ILinker ): void} fnCallback
	 */
	init( fnCallback ) {

		// загрузим полифилы если надо
		this.polyfills( () => {
				// передача объекта Linker для удобства
				fnCallback( this.oneLinker() );
			}
		);
	}

	polyfills( fnResolve ) {
		const oPolyfills = new this.Polyfills();
		for( let sPolyfill in this.oPolyfills ) {
			oPolyfills[ sPolyfill ] = this.oPolyfills[ sPolyfill ];
		}
		this.initCheck( oPolyfills );
		oPolyfills.base( fnResolve );
	}
}
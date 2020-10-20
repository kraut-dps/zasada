import { Box } from "di-box";
export class CoreBox extends Box {

	/**
	 * @type {function(new:Attrs)}
	 */
	Attrs;
	Dom;
	El;
	ElQuery;
	Linker;
	Polyfills;

	Storage;
	oPolyfills;
	RelQuery;
	deepKey;
	mergeDeep;

	/**
	 * @type {function(): Linker}
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
		oLinker.fnAssertUndefProps = this._initCheck;
		return oLinker;
	}

	/**
	 * @type {function(): Dom}
	 */
	oneDom() {
		return this.one( this.newDom );
	}
	newDom() {
		return new this.Dom();
	}

	/**
	 * @type {function(): Storage}
	 */
	oneStorage() {
		return this.one( this.newStorage );
	}
	newStorage() {
		const oStorage = new this.Storage();
		oStorage.oneDom = this.oneDom;
		oStorage.newQuery = this.newRelQuery;
		oStorage.newError = this.newError;
		return oStorage;
	}

	/**
	 * @type {function(): IAttrs}
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
	 * @type {function(): El}
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
	 * @param {function( Element, string ) } cClass
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

	newRelQuery() {
		const oRelQuery = new this.RelQuery();
		oRelQuery.oneStorage = this.oneStorage;
		return oRelQuery;
	};

	newElQuery( sEl ) {
		const oElQuery = new this.ElQuery( sEl );
		oElQuery.newError = this.newError;
		return oElQuery;
	}

	newError( oError ) {
		return oError;
	}

	/**
	 * @param {function( ILinker )} fnCallback
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
		this._initCheck( oPolyfills );
		oPolyfills.base( fnResolve );
	}
}
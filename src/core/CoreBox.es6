import { Box } from "zasada/src/Box.es6";
import { Linker } from "zasada/src/core/class/Linker.es6";
import { Storage } from "zasada/src/core/class/Storage.es6";
import { Attrs } from "zasada/src/core/class/Attrs.es6";
import { Dom } from "zasada/src/core/class/Dom.es6";
import { El } from "zasada/src/core/class/El.es6";
import { ElQuery } from "zasada/src/core/class/ElQuery.es6";
import { RelQuery } from "zasada/src/core/class/RelQuery.es6";
import { deepKey } from "zasada/src/utils/deepKey.es6";
import { mergeDeep } from 'zasada/src/utils/mergeDeep.es6';

export class CoreBox extends Box {

	/**
	 * @type {function(): ILinker}
	 */
	cLinker = Linker;

	/**
	 * @type {function(): Linker}
	 */
	oneLinker() {
		return this.one( this.newLinker );
	}
	newLinker () {
		const oLinker = new this.cLinker();
		oLinker.newWidget = this.baseNewWidget;
		oLinker.oneStorage = this.oneStorage;
		oLinker.oneDom = this.oneDom;
		oLinker.oneLogger = this.root().oneLogBox().oneLogger;
		oLinker.fnMergeDeep = mergeDeep;
		oLinker.fnDeepKey = deepKey;
		oLinker.fnAssertUndefProps = this._assertUndefProps;
		return oLinker;
	}

	/**
	 * @type {function(): Dom}
	 */
	oneDom() {
		return this.one( this.newDom );
	}
	newDom() {
		return new Dom();
	}

	/**
	 * @type {function(): Storage}
	 */
	oneStorage() {
		return this.one( this.newStorage );
	}
	newStorage() {
		const oStorage = new Storage();
		oStorage.oneDom = this.oneDom;
		oStorage.newQuery = this.newRelQuery;
		return oStorage;
	}

	/**
	 * @type {function(): Attrs}
	 */
	oneAttrs() {
		return this.one( this.newAttrs );
	}
	newAttrs() {
		return new Attrs();
	}

	/**
	 * @type {function(): El}
	 */
	oneEl() {
		return this.one( this.newEl );
	}
	newEl() {
		const oEl = new El();
		oEl.newElQuery = this.newElQuery;
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
		oWidget.fnOneLinker = this.oneLinker;
		oWidget.fnOneAttrs = this.oneAttrs;
		oWidget.fnOneEl = this.oneEl;
		return oWidget;
	}

	newRelQuery( fnStorage ) {
		return new RelQuery( fnStorage );
	};

	newElQuery( sEl ) {
		return new ElQuery( sEl );
	}
}
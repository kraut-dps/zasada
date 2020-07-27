import { Box } from "zasada/src/Box.js";
import { Linker } from "zasada/src/core/class/Linker.js";
import { Storage } from "zasada/src/core/class/Storage.js";
import { Attrs } from "zasada/src/core/class/Attrs.js";
import { Dom } from "zasada/src/core/class/Dom.js";
import { El } from "zasada/src/core/class/El.js";
import { ElQuery } from "zasada/src/core/class/ElQuery.js";
import { RelQuery } from "zasada/src/core/class/RelQuery.js";
import { deepKey } from "zasada/src/utils/deepKey.js";
import { mergeDeep } from 'zasada/src/utils/mergeDeep.js';

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
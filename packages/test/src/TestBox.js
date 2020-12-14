/**
 * @typedef {import('./interfaces').IHelperConstructor} IHelperConstructor
 * @typedef {import('./interfaces').IHelper} IHelper
 * @typedef {import('../../core/src/interfaces').ILinker} ILinker
 */
import {Box} from "di-box";

export class TestBox extends Box{

	/**
	 * @type {IHelperConstructor}
	 */
	Helper;

	/**
	 * @type {function(): ILinker}
	 */
	oneLinker;

	/**
	 * @type {function(): IHelper}
	 */
	oneHelper() {
		return this.one( this.newHelper );
	}

	newHelper () {
		const oHelper = new this.Helper();
		oHelper.oneLinker = this.oneLinker;
		return oHelper;
	}
}
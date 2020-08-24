import {Box} from "zasada/src/utils/Box.js";

export class TestBox extends Box{

	Helper;
	oneLinker;

	/**
	 * @type {function(): Linker}
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
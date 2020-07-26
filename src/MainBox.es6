import {CoreBox} from "zasada/src/core/CoreBox.es6";
import {Box} from "zasada/src/Box.es6";
import {PolyfillBox} from "zasada/src/polyfill/PolyfillBox.es6";
import {LogBox} from "zasada/src/log/LogBox.es6";

export class MainBox extends Box {

	basePolyfills( fnCallback ) {
		this.onePolyfillBox().base( fnCallback );
	}

	/**
	 * @type {function(): PolyfillBox}
	 */
	onePolyfillBox() {
		return this.one( this.newPolyfillBox );
	}

	newPolyfillBox() {
		return new PolyfillBox( this );
	}

	/**
	 * @type {function(): CoreBox}
	 */
	oneCoreBox() {
		return this.one( this.newCoreBox );
	}

	newCoreBox() {
		return new CoreBox( this );
	};

	/**
	 * @type {function(): LogBox}
	 */
	oneLogBox() {
		return this.one( this.newLogBox );
	}

	newLogBox() {
		return new LogBox( this );
	}
}

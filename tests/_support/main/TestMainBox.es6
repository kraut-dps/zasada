import {MainBox} from "../../../src/MainBox.es6";
import {TestPolyfillBox} from "../polyfill/TestPolyfillBox.es6";
import { TestLogBox } from "../log/TestLogBox.es6";
import {LogBox} from "zasada/src/log/LogBox.es6";

export class TestMainBox extends MainBox{
	
	addHtml( sHtml ) {
		const eDiv = document.createElement( 'div' );
		eDiv.innerHTML = sHtml;
		document.body.appendChild( eDiv );
		this._eContext = eDiv;
		return this.oneCoreBox().oneLinker().link( eDiv );
	}

	destroy() {
		this.oneCoreBox().oneLinker().unlink( this._eContext );
		this._eContext.parentNode.removeChild( this._eContext );
	}

	element( sSelector ) {
		return this._eContext.querySelector( sSelector );
	}

	widget( sSelector, cWidget ) {
		const eFrom = this.element( sSelector );
		return this.oneCoreBox().oneStorage()
			.query()
			.from( eFrom )
			.onlyFirst( true )
			.typeOf( cWidget )
			.find();
	}

	oneLogBox() {
		return this.one( this.newLogBox );
	}

	newLogBox() {
		return new TestLogBox( this );
	}

	newPolyfillBox = () => new TestPolyfillBox();
}
import {MainBox} from "zasada/src/MainBox.js";
import {Widget} from "zasada/src/Widget.js";

class AttrsWidget extends Widget {
	run() {
		this.bl().textContent += this.bl().outerHTML;

		const aFns = [
			() => this._attr( '', 'var1' ),
			() => this._attr( '', 'i:var2' ),
			() => this._attrs( '', { var1: 'i:v1', var2: 'f:v2', var3: 'mod:v3' } ),
		]

		aFns.forEach( ( fn ) => {
			this.bl().innerHTML +=  '<br/><br/>' + this._fnBody( fn ) + ' = <b>' + JSON.stringify( fn() ) + '</b>';
		} );
	}

	_fnBody( fn ) {
		const sFullCode = fn.toString();
		// https://stackoverflow.com/questions/3179861/javascript-get-function-body
		const sFnStart = 'return ';
		return sFullCode.substring( sFullCode.indexOf( sFnStart ) + sFnStart.length, sFullCode.lastIndexOf("}") );
	}
}

const oApp = new MainBox();
const oLinker = oApp.oneCoreBox().oneLinker();
oLinker.setWidgets( {
	AttrsWidget
} );
oApp.basePolyfills( () => {
	oLinker.link( document );
} );
import {MainBox} from "zasada/src/MainBox.js";
import {Widget} from "zasada/src/Widget.js";

class ElementsWidget extends Widget {
	run() {
		this._el( 'El1' ).textContent = 'El1';
		this._el( 'El2' ).textContent = 'El2';
		this._el( 'Item[]' ).forEach( ( eElement ) => {
			eElement.textContent = 'Item';
		} );
		this._el( '' ).style.color = 'red';
	}
}

const oApp = new MainBox();
const oLinker = oApp.oneCoreBox().oneLinker();
oLinker.setWidgets( {
	ElementsWidget
} );
oApp.basePolyfills( () => {
	oLinker.link( document );
} );
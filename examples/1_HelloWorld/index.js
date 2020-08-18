import {RootBox, Widget} from "zasada/src/index.js";
import oDeps from "zasada/src/deps.js";

class HelloWorld extends Widget {
	run() {
		this.bl().textContent = "Hello World!";
	}
}

const oRootBox = new RootBox( oDeps );
const oCoreBox = oRootBox.box( 'core' );
oCoreBox.polyfills( () => {
	const oLinker = oCoreBox.oneLinker();
	oLinker.setWidgets( {
		HelloWorld
	} );
	oLinker.link( document );
} );
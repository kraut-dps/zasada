import {RootBox, Widget} from "zasada/src/index.js";
import oDeps from "zasada/src/deps.js";

class HelloWorld extends Widget {
	run() {
		this.bl().textContent = "Hello World!";
	}
}

const oRootBox = new RootBox( oDeps );
oRootBox.box( 'core' ).init( ( oLinker ) => {
	oLinker.setWidgets( { HelloWorld } );
	oLinker.link( document );
} );
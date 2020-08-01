import {MainBox} from "zasada/src/MainBox.js";
import {Widget} from "zasada/src/Widget.js";

class HelloWorld extends Widget {
	run() {
		this.bl().textContent = "Hello World!";
	}
}

const oApp = new MainBox();
const oLinker = oApp.oneCoreBox().oneLinker();
oLinker.setWidgets( {
	HelloWorld
} );
oApp.basePolyfills( () => {
	oLinker.link( document );
} );
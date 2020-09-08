import {RootBox} from "di-box";
import {Widget} from "zasada/src/index.js";
import oDeps from "zasada/src/deps.js";

class HelloWorld extends Widget {
	/**
	 * этот метод запустится в Linker.link()
	 */
	run() {
		// виджет в своем блоке выводит "Hello World!"
		this.bl().textContent = "Hello World!";
	}
}

const oRootBox = new RootBox( oDeps );
oRootBox.box( 'core' ).init( ( oLinker ) => {
	// регистрация виджета
	oLinker.setWidgets( { HelloWorld } );

	// привязка виджетов к DOM всей страницы
	oLinker.link( document );
} );
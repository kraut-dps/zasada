import {RootBox} from "di-box";
import {Widget} from "zasada/src/index.js";
import oDeps from "zasada/src/deps.js";

class HelloWorld extends Widget {
	run() {
		// this.bl() вернет DOM Element к которому привязан виджет
		this.bl().textContent = "Hello World!";
	}
}

const oRootBox = new RootBox( oDeps );

// oRootBox.box( 'core' ) вернет новый объект CoreBox согласно oDeps
// внутри CoreBox.init() загрузка необходимых полифиллов, обработка window.onerror события
// callback, а не Promise, потому что на момент выполнения Promise полифилл может быть еще не загружен
oRootBox.box( 'core' ).init( ( oLinker ) => {

	// регистрация виджета
	oLinker.setWidgets( { HelloWorld } );

	// привязка виджетов ко всему документу
	oLinker.link( document );
} );
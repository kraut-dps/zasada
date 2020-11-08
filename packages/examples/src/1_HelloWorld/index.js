import oRoot from "@zasada/bootstrap";
import {Widget} from "@zasada/widget";

class HelloWorld extends Widget {
	run() {
		// this.bl() вернет DOM Element к которому привязан виджет
		this.bl().textContent = "Hello World!";
	}
}

oRoot.core.init( ( oLinker ) => {

	// регистрация виджета
	oLinker.setWidgets( { HelloWorld } );

	// привязка виджетов ко всему документу
	oLinker.link( document );
} );
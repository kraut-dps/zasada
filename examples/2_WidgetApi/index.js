import {RootBox} from "di-box";
import oDeps from "zasada/src/deps.js";
import {Example as ExampleBase} from "../Example.js";
import {Widget} from "zasada/src/index.js";


class TestWidget extends Widget {
	fWidgetVar = null;
	run() {
	}
}

class OtherWidget extends Widget {
	bActive = false;
	run() {}
	_getIndex() {
		return parseInt( this._attr( '', 'index' ) );
	}
	toggle() {
		this.bActive = !this.bActive;
		this._mod( '', 'active', this.bActive );
	}
}
class InsertWidget extends Widget {
	run() {
		this.bl().textContent = this._attr( '', 'index' );
	}
}

class Example extends ExampleBase {
	_exampleExec( fnExample ) {
		const oTestWidget = this.rel().from( this._el( 'Area' ) ).child().typeOf( TestWidget ).find();
		fnExample.call( oTestWidget, OtherWidget );
	}
}

const oRootBox = new RootBox( oDeps );
oRootBox.box( 'core' ).init( ( oLinker ) => {
	oLinker.setWidgets( { Example, TestWidget, OtherWidget, InsertWidget } );
	Example.renderExamples( oLinker );
} );

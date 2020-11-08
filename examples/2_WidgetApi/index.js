import {Widget} from "@zasada/widget";
import oRoot from "@zasada/bootstrap";
import {Example as ExampleBase} from "../Example.js";

class TestWidget extends Widget {
	fWidgetVar = null;
	run() {
	}
}

class OtherWidget extends Widget {
	bActive = false;
	run() {}
	_getIndex() {
		return this._attr( '', 'index' );
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
		const oTestWidget = this._rel().from( this._el( 'Area' ) ).child().typeOf( TestWidget ).find();
		fnExample.call( oTestWidget, OtherWidget );
	}
}

oRoot.core.init( ( oLinker ) => {
	oLinker.setWidgets( { Example, TestWidget, OtherWidget, InsertWidget } );
	Example.renderExamples( oLinker );
} );
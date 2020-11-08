import {Example as ExampleBase} from "../Example.js";
import {Widget} from "@zasada/widget";
import {RouteString} from "@zasada/log/src/route/RouteString.js";
import oRoot from "@zasada/bootstrap";

oRoot.core.init( ( oLinker ) => {

	class Example extends ExampleBase {

		bSkipLinkArea = true;

		_exampleExec( fnExample ) {

			// кастомные аргументы в вызове кода примера
			fnExample( oRoot, Widget, this._el( 'Area' ), RouteString );
		}
	}
	oLinker.setWidgets( { Example } );

	Example.renderExamples( oLinker );
} );

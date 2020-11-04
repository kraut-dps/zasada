import {RootBox} from "di-box";
import oDeps from "zasada/src/deps.js";
import {Example as ExampleBase} from "../Example.js";
import {Widget} from "zasada/src/index.js";
import {RouteString} from "zasada/packages/log/src/route/RouteString.js";

const oRootBox = new RootBox( oDeps );
oRootBox.box( 'core' ).init( ( oLinker ) => {

	class Example extends ExampleBase {

		bSkipLinkArea = true;

		_exampleExec( fnExample ) {

			// кастомные аргументы в вызове кода примера
			fnExample( RootBox, oDeps, Widget, this._el( 'Area' ), RouteString );
		}
	}
	oLinker.setWidgets( { Example } );

	Example.renderExamples( oLinker );
} );

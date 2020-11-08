import {Example as ExampleBase} from "../Example.js";
import {Widget} from "@zasada/widget";
import {importExt} from "@zasada/core/src/utils/importExt.js";
import oRoot from "@zasada/bootstrap";

oRoot.core.init( ( oLinker ) => {

	class Example extends ExampleBase {

		bSkipLinkArea = true;

		_exampleExec( fnExample ) {

			// кастомные аргументы в вызове кода примера
			fnExample( oLinker, Widget, importExt );
			oLinker.link( this._el( 'Area' ) );
		}
	}
	oLinker.setWidgets( { Example } );

	Example.renderExamples( oLinker );
} );
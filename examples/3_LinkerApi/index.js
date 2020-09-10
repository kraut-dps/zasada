import {RootBox} from "di-box";
import oDeps from "zasada/src/deps.js";
import {Example as ExampleBase} from "../Example.js";
import {Widget} from "zasada/src/index.js";
import {importExt} from "zasada/src/utils/importExt.js";

const oRootBox = new RootBox( oDeps );
oRootBox.box( 'core' ).init( ( oLinker ) => {

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

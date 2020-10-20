import oDeps from "./_support/deps.js";
import {RootBox} from "di-box";

describe( "CoreBox", () => {

	it( "error object", ( fnDone ) => {

		const oDepsClone = { ...{}, ...oDeps };

		// чтобы убрать связку с LogBox
		delete oDepsClone.core[ '&newError' ];

		const oRootBox = new RootBox( oDeps );
		oRootBox.box( 'core' ).init( ( oLinker ) => {
			const oHelper = oRootBox.box( 'test' ).oneHelper();

			oHelper.addHtml(
				'<div class="widget _ _UndefinedWidget"></div>'
			).catch( ( oError ) => {
				expect( oError.sHelp ).toBe( 'no-widget-opts' );
				fnDone();
			} );
		} );
	} );
} );
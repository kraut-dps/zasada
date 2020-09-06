import oDeps from "./_support/deps.js";
import {RootBox} from "di-box";

describe( "CoreBox", () => {

	it( "undefined Polyfills", () => {
		delete oDeps.core.Linker;
		const oRootBox = new RootBox( oDeps );
		try {
			oRootBox.box( 'core' ).oneLinker();
			fail();
		} catch( e ) {}
	} );
} );
import {RootBox} from "zasada/src/index.js";
import oDeps from "zasada/src/deps.js";

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
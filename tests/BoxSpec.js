import {Box} from "zasada/src/index.js";

describe( "Box", () => {

	it( "_assertUndefProps", () => {
		const oBox = new Box();
		class TestClass {
			sPublicProp;
			_sPrivateProp;
		}

		const oTest = new TestClass();
		try {
			oBox._assertUndefProps( oTest );
			fail();
		} catch( e ) {}

		oTest.sPublicProp = null;

		try {
			oBox._assertUndefProps( oTest );
		} catch( e ) {
			fail();
		}
	} );
} );
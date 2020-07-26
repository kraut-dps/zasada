import {Box} from "../src/Box.es6";

describe( "Box", () => {

	it( "importExt", ( hDone ) => {
		const oBox = new Box();
		oBox.importExt(
			'fakeUrl',
			() => {
				fail();
			},
			hDone
		);
	} );

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
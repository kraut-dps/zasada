import { deepKey } from "./../../src/utils/deepKey.js";
import { mergeDeep } from "./../../src/utils/mergeDeep.js";
import { importExt } from "./../../src/utils/importExt.js";

describe( "Utils", () => {

	it( "deepKey", () => {
		expect(
			deepKey(
				[ 'prop1', 'prop2' ],
				{ prop1: 10 },
				{ prop2: 20 }
			)
		).toEqual(
			{ prop1: 10, prop2: 20 }
		);


		expect(
			deepKey(
				{ prop1: 'prop1Alias', prop2: 'prop2Alias' },
				{ prop1: 10 },
				{ prop2: 20 }
			)
		).toEqual(
			{ prop1Alias: 10, prop2Alias: 20 }
		);
	} );

	it( "mergeDeep", () => {

		const oTarget = {
			prop1: {
				prop11: {
					prop111: 10
				}
			}
		};

		mergeDeep( oTarget, { prop1: { prop11: { prop111: 20 } } } );

		expect(
			oTarget
		).toEqual(
			{ prop1: { prop11: { prop111: 20 } } }
		);

	} );

	it( "importExt", ( fnDone ) => {

		importExt( "/bad404" )
			.catch( fnDone );
	} );
} );
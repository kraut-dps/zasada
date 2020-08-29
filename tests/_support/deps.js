import oDeps from "zasada/src/deps.js";
import {TestBox} from "zasada/src/test/TestBox.js";
import {Helper} from "zasada/src/test/Helper.js";

oDeps.core.mergeDeep(
	oDeps,
	{
		test: {
			_Box: TestBox,
			_fnRel: ( oRoot, oBox ) => {
				oBox.oneLinker = oRoot.box( 'core' ).oneLinker;
			},
			Helper
		},
		core:{
			// 	oPolyfills: {
			// 		pProto: () => {
			// 			return import( /* webpackIgnore: true */ '/base/node_modules/proto-polyfill/index.js' );
			// 		},
			// 		pWeakMap: () => {
			// 			return import( /* webpackIgnore: true */ '/base/node_modules/weakmap-polyfill/weakmap-polyfill.js' );
			// 		},
			// 		pClassList: () => {
			// 			return import( /* webpackIgnore: true */ '/base/node_modules/classlist-polyfill/src/index.js' );
			// 		}
			// 	}
		},
		log: {
			// pMapStack: () => {
			// 	return import(/* webpackIgnore: true */ '/base/node_modules/sourcemapped-stacktrace/dist/sourcemapped-stacktrace.js' )
			// 		.then( () => {
			// 			return window.sourceMappedStackTrace;
			// 		} );
			// }
		}
	}
);

export default oDeps;
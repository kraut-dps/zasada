import {oApp} from "app/base/index.es6";
const oLinker = oApp.oneCoreBox().oneLinker();
oLinker.setOpts( {
	HelloWorld: {
		oProps: {
			sModClass: 'mobile'
		}
	}
} );
oApp.basePolyfills( () => {
	oLinker.link( document );
} );
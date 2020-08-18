import {CoreBox} from "zasada/src/core/CoreBox.js";
import {Attrs} from "zasada/src/core/class/Attrs.js";
import {Dom} from "zasada/src/core/class/Dom.js";
import {El} from "zasada/src/core/class/El.js";
import {ElQuery} from "zasada/src/core/class/ElQuery.js";
import {Linker} from "zasada/src/core/class/Linker.js";
import {Polyfills} from "zasada/src/core/class/Polyfills.js";
import {RelQuery} from "zasada/src/core/class/RelQuery.js";
import {Storage} from "zasada/src/core/class/Storage.js";
import {deepKey} from "zasada/src/utils/deepKey.js";
import {mergeDeep} from 'zasada/src/utils/mergeDeep.js';

import {LogBox} from "zasada/src/log/LogBox.js";
import {Logger} from "zasada/src/log/Logger.js";
import {Error} from "zasada/src/log/Error.js";
import {RouteConsole} from "zasada/src/log/route/RouteConsole.js";



export default {

	core: {
		Box: CoreBox,
		Attrs,
		Dom,
		El,
		ElQuery,
		Linker,
		Polyfills,
		RelQuery,
		Storage,
		deepKey,
		mergeDeep,
		oneLogger: function() {
			return this.box( 'log' ).oneLogger();
		},
		newError: function( ...aArgs ) {
			return this.box( 'log' ).newError( ...aArgs );
		},
		oPolyfills: {
			sPromiseUrl: __webpack_public_path__ + '/polyfill-promise.js',
			pProto: () => import( /* webpackChunkName: "polyfill-proto" */ "proto-polyfill" ),
			pMozilla: () => import( /* webpackChunkName: "polyfill-mozilla" */ "zasada/src/utils/polyfillsMozilla.js" ),
			pWeakMap: () => import( /* webpackChunkName: "polyfill-weakmap" */ 'weakmap-polyfill' ),
			pClassList: () => import( /* webpackChunkName: "polyfill-classlist" */ 'classlist-polyfill' )
		}
	},

	log: {
		Box: LogBox,
		Logger,
		Error,
		oRouteTypes: {
			console: RouteConsole,
		},
		pMapStack: () => import( /* webpackChunkName: "map-stack" */ 'sourcemapped-stacktrace' )
	}
};
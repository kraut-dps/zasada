import {CoreBox} from "./core/CoreBox.js";
import {Attrs} from "./core/class/Attrs.js";
import {Dom} from "./core/class/Dom.js";
import {El} from "./core/class/El.js";
import {ElQuery} from "./core/class/ElQuery.js";
import {Linker} from "./core/class/Linker.js";
import {Polyfills} from "./core/class/Polyfills.js";
import {RelQuery} from "./core/class/RelQuery.js";
import {Storage} from "./core/class/Storage.js";
import {deepKey} from "./utils/deepKey.js";
import {mergeDeep} from "./utils/mergeDeep.js";

import {LogBox} from "./log/LogBox.js";
import {Logger} from "./log/Logger.js";
import {Error} from "./log/Error.js";
import {RouteConsole} from "./log/route/RouteConsole.js";

export default {
	core: {
		_Box: CoreBox,
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
		"&oneLogger": "log",
		"&newError": "log",
		oPolyfills: {
			sPromiseUrl: __webpack_public_path__ + '/polyfill-promise.js',
			pProto: () => import( /* webpackChunkName: "polyfill-proto" */ "proto-polyfill" ),
			pMozilla: () => import( /* webpackChunkName: "polyfill-mozilla" */ "zasada/src/utils/polyfillsMozilla.js" ),
			pWeakMap: () => import( /* webpackChunkName: "polyfill-weakmap" */ 'weakmap-polyfill' ),
			pClassList: () => import( /* webpackChunkName: "polyfill-classlist" */ 'classlist-polyfill' )
		}
	},

	log: {
		_Box: LogBox,
		Logger,
		Error,
		oRouteTypes: {
			console: RouteConsole,
		},
		pMapStack: () => import( /* webpackChunkName: "map-stack" */ 'sourcemapped-stacktrace' )
	}
};
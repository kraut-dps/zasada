import {CoreBox} from "./CoreBox.js";
import {Attrs} from "./class/Attrs.js";
import {Dom} from "./class/Dom.js";
import {El} from "./class/El.js";
import {ElQuery} from "./class/ElQuery.js";
import {Linker} from "./class/Linker.js";
import {Polyfills} from "./class/Polyfills.js";
import {RelQuery} from "./class/RelQuery.js";
import {Storage} from "./class/Storage.js";
import {deepKey} from "./../utils/deepKey.js";
import {mergeDeep} from "./../utils/mergeDeep.js";

export default {
	Attrs: Attrs,
	Dom,
	El,
	ElQuery,
	Linker,
	Polyfills,
	RelQuery,
	Storage,
	deepKey,
	mergeDeep,
	oPolyfills: {
		sPromiseUrl: __webpack_public_path__ + '/polyfill-promise.js',
		pProto: () => import( /* webpackChunkName: "polyfill-proto" */ "proto-polyfill" ),
		pMozilla: () => import( /* webpackChunkName: "polyfill-mozilla" */ "./../utils/polyfillsMozilla.js" ),
		pWeakMap: () => import( /* webpackChunkName: "polyfill-weakmap" */ 'weakmap-polyfill' ),
		pClassList: () => import( /* webpackChunkName: "polyfill-classlist" */ 'classlist-polyfill' )
	}
};
export {CoreBox as _Box};
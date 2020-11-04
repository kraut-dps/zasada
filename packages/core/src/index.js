import {CoreBox} from "./CoreBox.js";
import {Attrs} from "./class/Attrs.js";
import {Dom} from "./class/Dom.js";
import {El} from "./class/El.js";
import {ElQuery} from "./class/ElQuery.js";
import {Linker} from "./class/Linker.js";
import {Polyfills} from "./class/Polyfills.js";
import {RelQuery} from "./class/RelQuery.js";
import {Storage} from "./class/Storage.js";
import {deepKey} from "./utils/deepKey.js";
import {mergeDeep} from "./utils/mergeDeep.js";

const oBox = new CoreBox();
oBox.Attrs = Attrs;
oBox.Dom = Dom;
oBox.El = El;
oBox.ElQuery = ElQuery;
oBox.Linker = Linker;
oBox.Polyfills = Polyfills;
oBox.RelQuery = RelQuery;
oBox.Storage = Storage;
oBox.deepKey = deepKey;
oBox.mergeDeep = mergeDeep;
oBox.oPolyfills = {
	sPromiseUrl: __webpack_public_path__ + '/polyfill-promise.js',
	pProto: () => import( /* webpackChunkName: "polyfill-proto" */ "proto-polyfill" ),
	pMozilla: () => import( /* webpackChunkName: "polyfill-mozilla" */ "./utils/polyfillsMozilla.js" ),
	pWeakMap: () => import( /* webpackChunkName: "polyfill-weakmap" */ 'weakmap-polyfill' ),
	pClassList: () => import( /* webpackChunkName: "polyfill-classlist" */ 'classlist-polyfill' )
};
export {oBox as default};
declare namespace _default {
    export { Attrs };
    export { Dom };
    export { El };
    export { ElQuery };
    export { Linker };
    export { Polyfills };
    export { RelQuery };
    export { Storage };
    export { deepKey };
    export { mergeDeep };
    export namespace oPolyfills {
        const sPromiseUrl: string;
        function pProto(): Promise<any>;
        function pMozilla(): Promise<typeof import("./utils/polyfillsMozilla.js")>;
        function pWeakMap(): Promise<any>;
        function pClassList(): Promise<any>;
    }
}
export default _default;
export { CoreBox as _Box };
import { Attrs } from "./class/Attrs.js";
import { Dom } from "./class/Dom.js";
import { El } from "./class/El.js";
import { ElQuery } from "./class/ElQuery.js";
import { Linker } from "./class/Linker.js";
import { Polyfills } from "./class/Polyfills.js";
import { RelQuery } from "./class/RelQuery.js";
import { Storage } from "./class/Storage.js";
import { deepKey } from "./utils/deepKey.js";
import { mergeDeep } from "./utils/mergeDeep.js";
import { CoreBox } from "./CoreBox.js";

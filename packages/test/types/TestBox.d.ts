export class TestBox extends Box {
    /**
     * @type {IHelperConstructor}
     */
    Helper: IHelperConstructor;
    /**
     * @type {function(): ILinker}
     */
    oneLinker: () => ILinker;
    /**
     * @type {function(): IHelper}
     */
    oneHelper(): IHelper;
    newHelper(): import("./interfaces").IHelperInit;
}
export type IHelperConstructor = import("./interfaces").IHelperConstructor;
export type IHelper = import("./interfaces").IHelper;
export type ILinker = import("@zasada/core/src/interfaces").ILinker;
import { Box } from "di-box";
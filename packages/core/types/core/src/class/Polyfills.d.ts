/**
 * @typedef {import('./../interfaces').IPolyfills} IPolyfills
 */
/**
 * @implements IPolyfills
 */
export class Polyfills implements IPolyfills {
    sPromiseUrl: any;
    pProto: any;
    pMozilla: any;
    pWeakMap: any;
    pClassList: any;
    pBlob: any;
    pFormData: any;
    base(fnCallback: any): void;
    Promise(fnResolve: any): void;
    ObjectProto(): Promise<any>;
    Mozilla(): Promise<any>;
    WeakMap(): Promise<any>;
    ElementClassList(): Promise<any>;
    Blob(): Promise<any>;
    FormData(): Promise<any>;
}
export type IPolyfills = import("../interfaces.js").IPolyfills;

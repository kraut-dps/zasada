/**
 * @typedef {import('./interfaces').IAttrs} IAttrs
 * @typedef {import('./interfaces').IAttrsConstructor} IAttrsConstructor
 * @typedef {import('./interfaces').IDom} IDom
 * @typedef {import('./interfaces').IDomConstructor} IDomConstructor
 * @typedef {import('./interfaces').IEl} IEl
 * @typedef {import('./interfaces').IElConstructor} IElConstructor
 * @typedef {import('./interfaces').ILinker} ILinker
 * @typedef {import('./interfaces').IWidget} IWidget
 */
export class CoreBox extends Box {
    /**
     * @type {IAttrsConstructor}
     */
    Attrs: IAttrsConstructor;
    /**
     * @type {IDomConstructor}
     */
    Dom: IDomConstructor;
    El: any;
    ElQuery: any;
    Linker: any;
    Polyfills: any;
    Storage: any;
    RelQuery: any;
    deepKey: any;
    mergeDeep: any;
    oPolyfills: any;
    /**
     * @return {ILinker}
     */
    oneLinker(): ILinker;
    newLinker(): any;
    /**
     * @return {IDom}
     */
    oneDom(): IDom;
    newDom(): import("./interfaces").IDom;
    oneStorage(): any;
    newStorage(): any;
    /**
     * @return {IAttrs}
     */
    oneAttrs(): IAttrs;
    newAttrs(): import("./interfaces").IAttrsInit;
    oneEl(): any;
    newEl(): any;
    /**
     * @param {Element} eElement
     * @param {string} sBlockId
     * @param {function( Element, string ):void } cClass
     * @returns {IWidget}
     */
    baseNewWidget(eElement: Element, sBlockId: string, cClass: (arg0: Element, arg1: string) => void): IWidget;
    newRelQuery(): any;
    newElQuery(sEl: any): any;
    /**
     * @param oError
     * @return number
     */
    newError(oError: any): any;
    /**
     * @param {function( ILinker ): void} fnCallback
     */
    init(fnCallback: (arg0: ILinker) => void): void;
    polyfills(fnResolve: any): void;
}
export type IAttrs = import("./interfaces").IAttrs;
export type IAttrsConstructor = import("./interfaces").IAttrsConstructor;
export type IDom = import("./interfaces").IDom;
export type IDomConstructor = import("./interfaces").IDomConstructor;
export type IEl = import("./interfaces").IEl;
export type IElConstructor = import("./interfaces").IElConstructor;
export type ILinker = import("./interfaces").ILinker;
export type IWidget = import("./interfaces").IWidget;
import { Box } from "di-box";

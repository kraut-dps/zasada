/**
 * @typedef {import('./interfaces').IAttrs} IAttrs
 * @typedef {import('./interfaces').IAttrsConstructor} IAttrsConstructor
 * @typedef {import('./interfaces').IDom} IDom
 * @typedef {import('./interfaces').IDomConstructor} IDomConstructor
 * @typedef {import('./interfaces').IEl} IEl
 * @typedef {import('./interfaces').IElConstructor} IElConstructor
 * @typedef {import('./interfaces').IElQuery} IElQuery
 * @typedef {import('./interfaces').IElQueryConstructor} IElQueryConstructor
 * @typedef {import('./interfaces').ILinkerConstructor} ILinkerConstructor
 * @typedef {import('./interfaces').ILinker} ILinker
 * @typedef {import('./interfaces').IRelQuery} IRelQuery
 * @typedef {import('./interfaces').IRelQueryConstructor} IRelQueryConstructor
 * @typedef {import('./interfaces').IStorage} IStorage
 * @typedef {import('./interfaces').IStorageConstructor} IStorageConstructor
 * @typedef {import('./interfaces').IWidget} IWidget
 * @typedef {import('./interfaces').IWidgetConstructor} IWidgetConstructor
 * @typedef {import('./interfaces').ICustomErrorProps} ICustomErrorProps
 * @typedef {import('./interfaces').IPolyfillsConstructor} IPolyfillsConstructor
 */
export class CoreBox extends Box {
    /** @type {IAttrsConstructor} */
    Attrs: IAttrsConstructor;
    /** @type {IDomConstructor} */
    Dom: IDomConstructor;
    /** @type {IElConstructor} */
    El: IElConstructor;
    /** @type {IElQueryConstructor} */
    ElQuery: IElQueryConstructor;
    /** @type {ILinkerConstructor} */
    Linker: ILinkerConstructor;
    /** @type {IPolyfillsConstructor} */
    Polyfills: IPolyfillsConstructor;
    /** @type {IStorageConstructor} */
    Storage: IStorageConstructor;
    /** @type {IRelQueryConstructor} */
    RelQuery: IRelQueryConstructor;
    deepKey: any;
    mergeDeep: any;
    oPolyfills: any;
    /**
     * @return {ILinker}
     */
    oneLinker(): ILinker;
    newLinker(): import("./interfaces").ILinkerInit;
    /**
     * @return {IDom}
     */
    oneDom(): IDom;
    newDom(): import("./interfaces").IDom;
    /**
     * @return {IStorage}
     */
    oneStorage(): IStorage;
    newStorage(): import("./interfaces").IStorageInit;
    /**
     * @return {IAttrs}
     */
    oneAttrs(): IAttrs;
    newAttrs(): import("./interfaces").IAttrsInit;
    /**
     * @return {IEl}
     */
    oneEl(): IEl;
    newEl(): import("./interfaces").IElInit;
    /**
     * @param {Element} eElement
     * @param {string} sBlockId
     * @param {IWidgetConstructor} cClass
     * @returns {IWidget}
     */
    baseNewWidget(eElement: Element, sBlockId: string, cClass: IWidgetConstructor): IWidget;
    /**
     * @return {IRelQuery}
     */
    newRelQuery(): IRelQuery;
    /**
     * @param sEl
     * @return {IElQuery}
     */
    newElQuery(sEl: any): IElQuery;
    /**
     * @param {ICustomErrorProps} oError
     * @return ICustomErrorProps
     */
    newError(oError: ICustomErrorProps): import("./interfaces").ICustomErrorProps;
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
export type IElQuery = import("./interfaces").IElQuery;
export type IElQueryConstructor = import("./interfaces").IElQueryConstructor;
export type ILinkerConstructor = import("./interfaces").ILinkerConstructor;
export type ILinker = import("./interfaces").ILinker;
export type IRelQuery = import("./interfaces").IRelQuery<import("./interfaces").IWidget>;
export type IRelQueryConstructor = import("./interfaces").IRelQueryConstructor;
export type IStorage = import("./interfaces").IStorage;
export type IStorageConstructor = import("./interfaces").IStorageConstructor;
export type IWidget = import("./interfaces").IWidget;
export type IWidgetConstructor = import("./interfaces").IWidgetConstructor;
export type ICustomErrorProps = import("./interfaces").ICustomErrorProps;
export type IPolyfillsConstructor = import("./interfaces").IPolyfillsConstructor;
import { Box } from "di-box";

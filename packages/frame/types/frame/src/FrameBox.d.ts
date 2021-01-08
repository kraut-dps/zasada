/**
 * @typedef {import('./interfaces').ILinker} ILinker
 * @typedef {import('./interfaces').IStorage} IStorage
 * @typedef {import('./interfaces').IRelQuery} IRelQuery
 * @typedef {import('./interfaces').IBtnInit} IBtnInit
 * @typedef {import('./interfaces').IFormInit} IFormInit
 * @typedef {import('./interfaces').IFormFieldInit} IFormFieldInit
 * @typedef {import('./interfaces').IAreaInit} IAreaInit
 * @typedef {import('./interfaces').ILayersInit} ILayersInit
 * @typedef {import('./interfaces').IFrameInit} IFrameInit
 * @typedef {import('./interfaces').IHistoryInit} IHistoryInit
 * @typedef {import('./interfaces').IRequest} IRequest
 */
export class FrameBox extends Box {
    constructor(oOpts?: import("di-box").IOpts);
    /**
     * @type {function(): ILinker}
     */
    oneLinker: () => ILinker;
    /**
     * @type {function(): IStorage}
     */
    oneStorage: () => IStorage;
    /**
     * @type {function(): IRelQuery}
     */
    newRelQuery: () => IRelQuery;
    Area: any;
    Btn: any;
    Frame: any;
    Form: any;
    FormField: any;
    History: any;
    HistoryAdapter: any;
    Layer: any;
    Layers: any;
    RemoteValidator: any;
    Request: any;
    deepKey: any;
    init(): void;
    _setWidgets(): void;
    _setOpts(): void;
    /**
     * @type {function(): IRequest}
     */
    oneRequest(): IRequest;
    newRequest(): any;
    newRemoteValidator(eForm: any): any;
    newXhr(): XMLHttpRequest;
    oneHistoryAdapter(): any;
    newHistoryAdapter(): any;
}
export type ILinker = import("@zasada/core/src/interfaces").ILinker;
export type IStorage = import("@zasada/core/src/interfaces").IStorage;
export type IRelQuery = import("@zasada/core/src/interfaces").IRelQuery<import("@zasada/core/src/interfaces").IWidget>;
export type IBtnInit = import("./interfaces").IBtnInit;
export type IFormInit = import("./interfaces").IFormInit;
export type IFormFieldInit = import("./interfaces").IFormFieldInit;
export type IAreaInit = import("./interfaces").IAreaInit;
export type ILayersInit = import("./interfaces").ILayersInit;
export type IFrameInit = import("./interfaces").IFrameInit;
export type IHistoryInit = import("./interfaces").IHistoryInit;
export type IRequest = import("./interfaces").IRequest;
import { Box } from "di-box";

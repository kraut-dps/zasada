/**
 * @typedef {import('./interfaces').ILogger} ILogger
 * @typedef {import('./interfaces').ILoggerConstructor} ILoggerConstructor
 * @typedef {import('./interfaces').ICustomError} ICustomError
 * @typedef {import('./interfaces').ICustomErrorConstructor} ICustomErrorConstructor
 * @typedef {import('./interfaces').IRouteTypes} IRouteTypes
 */
export class LogBox extends Box {
    constructor(sNeedCheckPrefix?: string, sProtectedPrefix?: string);
    /**
     * @type {ILoggerConstructor}
     */
    Logger: ILoggerConstructor;
    /**
     * @type {ICustomErrorConstructor}
     */
    Error: ICustomErrorConstructor;
    /**
     * @type {IRouteTypes}
     */
    oRouteTypes: IRouteTypes;
    /**
     * @type {function(): Promise<any>}
     */
    pMapStack: () => Promise<any>;
    /**
     * @type {function(): ILogger}
     */
    oneLogger(): ILogger;
    newLogger(): import("./interfaces").ILoggerInit;
    newError(oProps: any): any;
    init(): void;
    errorInOnerror(oError: any, message: any, sourceURL: any, line: any, column: any, oErrorOrigin: any): void;
    errorInOnunhandledrejection(oError: any, oEvent: any): void;
}
export type ILogger = import("./interfaces").ILogger;
export type ILoggerConstructor = import("./interfaces").ILoggerConstructor;
export type ICustomError = import("./interfaces").ICustomError;
export type ICustomErrorConstructor = import("./interfaces").ICustomErrorConstructor;
export type IRouteTypes = import("./interfaces").IRouteTypes;
import { Box } from "di-box";

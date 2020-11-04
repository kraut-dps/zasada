/**
 * @typedef {import('./interfaces').ILogger} ILogger
 * @typedef {import('./interfaces').ILoggerConstructor} ILoggerConstructor
 * @typedef {import('./interfaces').ICustomError} ICustomError
 * @typedef {import('./interfaces').ICustomErrorConstructor} ICustomErrorConstructor
 */
export class LogBox extends Box {
    /**
     * @type {ILoggerConstructor}
     */
    Logger: ILoggerConstructor;
    /**
     * @type {ICustomErrorConstructor}
     */
    Error: ICustomErrorConstructor;
    oRouteTypes: any;
    pMapStack: any;
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
import { Box } from "di-box";

/**
 * @typedef {import('./interfaces').ILogger} ILogger
 * @typedef {import('./interfaces').ILoggerInit} ILoggerInit
 * @typedef {import('./interfaces').ICustomError} ICustomError
 * @typedef {import('./interfaces').ILogRoute} ILogRoute
 */
/**
 * логирование ошибок
 * @type ILoggerInit
 */
export class Logger {
    oRouteTypes: any;
    newError: any;
    oRoutes: any;
    /**
     * sourcemapped-stacktrace
     * @type {function(): Promise<object>}
     */
    pMapStack: () => Promise<object>;
    /**
     * обработка ошибки
     */
    error(mError: any): void;
    /**
     * обогащение ошибки mapped stack, если это возможно
     * без Promise, может к моменту вызова не быть еще полифила
     * @param {ICustomError} oError
     * @param {any} fnDone
     */
    _setStackMapped(oError: ICustomError, fnDone: any): void;
    /**
     * @return {null|ILogRoute[]}
     * @protected
     */
    protected _getRoutes(): null | ILogRoute[];
}
export type ILogger = import("./interfaces").ILogger;
export type ILoggerInit = import("./interfaces").ILoggerInit;
export type ICustomError = import("./interfaces").ICustomError;
export type ILogRoute = import("./interfaces").ILogRoute;

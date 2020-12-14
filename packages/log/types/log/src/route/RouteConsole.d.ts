/**
 * @typedef {import('./../interfaces').ILogRoute} ILogRoute
 */
/**
 * логирование ошибок в консоль
 * @implements ILogRoute
 */
export class RouteConsole implements ILogRoute {
    error(oError: any): void;
    /**
     *
     * @param {array} aArgs
     * @param {object} oError
     */
    _send(aArgs: any[], oError: object): void;
}
export type ILogRoute = import("../interfaces").ILogRoute;

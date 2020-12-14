/**
 * @typedef {import('./../interfaces').ILogRoute} ILogRoute
 */
/**
 * логирование ошибок в строку, и отправка куда-либо
 * @implements ILogRoute
 */
export class RouteString implements ILogRoute {
    error(oError: any): void;
    /**
     * @param {string} sMessage
     * @param {object} oError
     */
    _send(sMessage: string, oError: object): void;
}
export type ILogRoute = import("../interfaces").ILogRoute;

/**
 * @typedef {import('./../interfaces').IElInit} IElInit
 * @typedef {import('./../interfaces').IElQuery} IElQuery
 * @typedef {import('./../interfaces').IDom} IDom
 * @typedef {import('./../interfaces').IWidget} IWidget
 */
/**
 * поиск элементов
 * @implements IElInit
 */
export class El implements IElInit {
    /**
     * @type {function( string ):IElQuery}
     */
    newElQuery: (arg0: string) => IElQuery;
    newError: any;
    /**
     * @type {function(): IDom}
     */
    oneDom: () => IDom;
    /**
     * кеш запросов
     * @type {Object.<string, IElQuery>}
     */
    _oQueries: {
        [x: string]: IElQuery;
    };
    /**
     * кеш элементов
     * @type {WeakMap}
     */
    _oEls: WeakMap<any, any>;
    /**
     * поиск элементов в виджете
     * @param {IWidget} oWidget
     * @param {string|IElQuery} mQuery
     * @return {null|Element|Element[]}
     */
    find(oWidget: IWidget, mQuery: string | IElQuery): null | Element | Element[];
    resetCache(oWidget: any): void;
    parse(sEl: any): import("../interfaces").IElQuery;
    _findInCache(oWidget: any, oElQuery: any): any;
    /**
     *
     * @param {IWidget} oWidget
     * @param {IElQuery} oElQuery
     * @return {Element[]}
     * @private
     */
    private _findEl;
    _clone(oObj: any): any;
}
export type IElInit = import("../interfaces").IElInit;
export type IElQuery = import("../interfaces").IElQuery;
export type IDom = import("../interfaces").IDom;
export type IWidget = import("../interfaces").IWidget;

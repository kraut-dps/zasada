/**
 * @typedef {import('./../interfaces').IRelQuery} IRelQuery
 * @typedef {import('./../interfaces').IRelQueryInit} IRelQueryInit
 * @typedef {import('./../interfaces').IStorage} IStorage
 * @typedef {import('./../interfaces').IWidget} IWidget
 */
/**
 * формирование запроса на поиск виджетов
 * @implements IRelQueryInit
 */
export class RelQuery implements IRelQueryInit {
    cTypeOf: any;
    eFrom: any;
    bWithFrom: boolean;
    /**
     * all, child, parent, next, prev, self
     * @type {string}
     */
    sWay: string;
    bOnlyFirst: boolean;
    aBlockIds: any;
    aIndex: any[];
    sCssSel: string;
    bCanEmpty: boolean;
    /**
     * @type {function():IStorage}
     */
    oneStorage: () => IStorage;
    _oWidget: any;
    /**
     * @param cTypeOf
     * @return {RelQuery}
     */
    typeOf(cTypeOf: any): RelQuery;
    /**
     * @return {RelQuery}
     */
    parent(): RelQuery;
    /**
     * @return {RelQuery}
     */
    child(): RelQuery;
    /**
     * @return {RelQuery}
     */
    next(): RelQuery;
    /**
     * @return {RelQuery}
     */
    prev(): RelQuery;
    /**
     * @return {RelQuery}
     */
    self(): RelQuery;
    /**
     * @param {Element} eFrom
     * @return {RelQuery}
     */
    from(eFrom: Element): RelQuery;
    /**
     * @param {boolean} bWithFrom
     * @return {RelQuery}
     */
    withFrom(bWithFrom?: boolean): RelQuery;
    /**
     * @param {string|string[]} mIndex
     * @return {RelQuery}
     */
    index(mIndex: string | string[]): RelQuery;
    /**
     * @param {string} sCssSel
     * @return {RelQuery}
     */
    cssSel(sCssSel: string): RelQuery;
    /**
     * @param {boolean} bCanEmpty
     * @return {RelQuery}
     */
    canEmpty(bCanEmpty?: boolean): RelQuery;
    /**
     * @param {boolean} bOnlyFirst
     * @return {RelQuery}
     */
    onlyFirst(bOnlyFirst?: boolean): RelQuery;
    /**
     * @param oWidget
     * @return {RelQuery}
     */
    widget(oWidget: any): RelQuery;
    getWidget(): any;
    /**
     * @param {string|string[]} mBlockId
     * @return {RelQuery}
     */
    blockId(mBlockId: string | string[]): RelQuery;
    /**
     * @param bAll
     * @return {any}
     */
    find(bAll?: any): any;
    /**
     * @return {any}
     */
    getQuery(): any;
    /**
     * добавить обработчик события
     * @param sEvent
     * @param fnHandler
     * @return {RelQuery}
     */
    on(sEvent: any, fnHandler: any): RelQuery;
    /**
     * убрать обработчик события
     */
    /**
     * @deprecated
     * use this.on()
     */
    onAdd(fnHandler: any): RelQuery;
    /**
     * @deprecated
     * use this.on()
     */
    onDrop(fnHandler: any): RelQuery;
}
export type IRelQuery = import("../interfaces").IRelQuery<import("../interfaces").IWidget>;
export type IRelQueryInit = import("../interfaces").IRelQueryInit;
export type IStorage = import("../interfaces").IStorage;
export type IWidget = import("../interfaces").IWidget;

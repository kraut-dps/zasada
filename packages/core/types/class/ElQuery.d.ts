/**
 * @typedef {import('./../interfaces').IElQueryInit} IElQueryInit
 * @typedef {import('./../interfaces').IElQuery} IElQuery
 */
/**
 * формирование запроса на поиск елемента внутри блока
 * @implements IElQueryInit
 */
export class ElQuery implements IElQueryInit {
    constructor(sQuery: any);
    newError: any;
    sId: string;
    bOnlyFirst: boolean;
    bCanEmpty: boolean;
    bWithFrom: boolean;
    bNoCache: boolean;
    parse(sQuery: any): void;
    /**
     * разбирает запрос справа налево
     * @param {string[]} aQuery
     * @return {string[]}
     * @private
     */
    private _parseDir;
    key(): string;
    /**
     * @param {string} sId
     * @return {IElQuery|this}
     */
    id(sId: string): IElQuery | this;
    getId(): string;
    /**
     * @param {boolean} bWithFrom
     * @return {IElQuery|this}
     */
    withFrom(bWithFrom: boolean): IElQuery | this;
    isWithFrom(): boolean;
    /**
     * @param {boolean} bCanEmpty
     * @return {IElQuery|this}
     */
    canEmpty(bCanEmpty: boolean): IElQuery | this;
    isCanEmpty(): boolean;
    /**
     * @param {boolean} bOnlyFirst
     * @return {IElQuery|this}
     */
    onlyFirst(bOnlyFirst: boolean): IElQuery | this;
    isOnlyFirst(): boolean;
    /**
     * @param {boolean} bNoCache
     * @return {IElQuery|this}
     */
    noCache(bNoCache: boolean): IElQuery | this;
    isNoCache(): boolean;
}
export type IElQueryInit = import("../interfaces").IElQueryInit;
export type IElQuery = import("../interfaces").IElQuery;

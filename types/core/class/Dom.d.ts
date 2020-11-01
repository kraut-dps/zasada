/**
 * @typedef {import('./../interfaces').IDom} IDom
 */
/**
 * работа с DOM деревом
 * @implements IDom
 */
export class Dom implements IDom {
    /**
     * найти потомков относительно переданого
     * @param {Element} eContext
     * @param {string} sSel
     * @param {boolean} bWithSelf
     * @param {boolean} bOnlyFirst
     * @returns {Element[]}
     */
    children(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];
    /**
     * найти предков относительно переданого
     * @param {Element} eContext
     * @param {string} sSel
     * @param {boolean} bWithSelf
     * @param {boolean} bOnlyFirst
     * @returns {Element[]}
     */
    parents(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];
    nexts(eContext: any, sSel: any, bWithSelf: any, bOnlyFirst: any): any[];
    prevs(eContext: any, sSel: any, bWithSelf: any, bOnlyFirst: any): any[];
    _loop(eContext: any, sSel: any, bWithSelf: any, bOnlyFirst: any, sPropName: any): any[];
    /**
     * по переданому DOM Element определяем id виджетов
     * @param {Element} eContext
     * @returns {String[]}
     */
    parseBlockIds(eContext: Element): string[];
    /**
     * определение селектора для выбора
     * всех блоков '._'
     * конкретных блоков '._BlockId'
     * конкретных элементов блоков '._BlockId-ElementId'
     * @param {string} sBlockId
     * @param {string} sElementId
     * @returns {string}
     */
    sel(sBlockId?: string, sElementId?: string): string;
}
export type IDom = import("../interfaces").IDom;

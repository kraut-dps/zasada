/**
 * @typedef {import('./../interfaces').IAttrsInit} IAttrsInit
 */
/**
 * разбор значений и конвертация типов из атрибутов Element
 * @implements IAttrsInit
 */
export class Attrs implements IAttrsInit {
    /**
     * @type {function( object ): any}
     */
    newError: (arg0: object) => any;
    /**
     * @type {object} алиасы методов преобразования типа
     */
    oCasts: object;
    /**
     * @type {string} префикс названия атрибута по умолчанию
     */
    sPrefix: string;
    /**
     * @type {string} разделитель типа от значения по умолчанию
     */
    sSep: string;
    /**
     * @type {string} тип по умолчанию
     */
    sType: string;
    /**
     * @type {string} разделитель название X значение для mod типа
     */
    sModSepVal: string;
    /**
     * @type {string} разделитель выражений для mod типа
     */
    sModSepItem: string;
    /**
     * Разбор атрибутов
     * @param {Element[]} aElements
     * @param {string|string[]|object} mMap
     * @param {string|null} sPrefix
     * @return {Object.<string, any>}
     */
    parse(aElements: Element[], mMap: string | string[] | object, sPrefix?: string | null): {
        [x: string]: any;
    };
    /**
     * internal
     * @param {string[]|string[][]|object} mMap
     * @return {string[][]}
     */
    _parseMap(mMap: string[] | string[][] | object): string[][];
    /**
     * internal
     * sMapItem = "i:int", sFrom = null => [ "int", "int", 'i' ]
     * sMapItem = "i:int", sFrom = "from" => [ "from", "int", 'i' ]
     * sMapItem = "string", sFrom = null => [ "string", "string", 's' ]
     * @param {string} sMapItem
     * @param {string|null} sFrom
     * @return {string[]}
     */
    _parseMapItem(sMapItem: string, sFrom?: string | null): string[];
    _toStr(sValue: any): any;
    _toBool(sValue: any): boolean;
    _toInt(sValue: any): number;
    _toFloat(sValue: any): number;
    /**
     * "one, two" => ['one', 'two']
     */
    _toArrayOfString(sValue: any): any[];
    /**
     * "1=one,2=two,3=three" => {"1": "one", "2": "two", "3": "three"}
     */
    _toMod(sValue: any): {};
    _toJson(sValue: any): any;
}
export type IAttrsInit = import("../interfaces").IAttrsInit;

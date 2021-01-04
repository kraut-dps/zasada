/**
 * @typedef {import('./../interfaces').IStorageInit} IStorageInit
 * @typedef {import('./../interfaces').IDom} IDom
 * @typedef {import('./../interfaces').IRelQuery} IRelQuery
 * @typedef {import('./../interfaces').IWidget} IWidget
 */
/**
 * хранилище виджетов
 * @implements IStorageInit
 */
export class Storage implements IStorageInit {
    /**
     * @type {function(): IDom}
     */
    oneDom: () => IDom;
    newError: any;
    /**
     * @type {WeakMap} eBlock => { sBlockId1: oWidget1, sBlockId2: oWidget2 }
     */
    _oMap: WeakMap<any, any>;
    /**
     * @type {WeakMap} cWidget => [ sBlockId1, sBlockId2, ... ]
     */
    _oWidgetBlockIds: WeakMap<any, any>;
    /**
     * @type {object} { sEventName: { oRelQuery: RelQuery, fnHandler: function() } )
     */
    _oEventFns: object;
    /**
     * @type {object} { oWidget: { sEvent: string, oRelQuery: RelQuery, fnHandler: function() } )
     */
    _oWidgetEventMap: object;
    /**
     * @type {Object} sBlockId: { sIndex => oWidget }
     */
    _oIndex: any;
    /**
     * добавление виджета
     * @param {IWidget} oWidget
     */
    add(oWidget: IWidget): void;
    /**
     * удаление узла
     * @param {Element} eContext
     * @param {boolean} bWithSelf
     * @returns {IWidget[]}
     */
    drop(eContext: Element, bWithSelf: boolean): IWidget[];
    /**
     * @return {IRelQuery}
     */
    /**
     * @param {IRelQuery} oRelQuery
     * @return {IWidget[]}
     */
    find(oRelQuery: IRelQuery): IWidget[];
    on(oRelQuery: any, sEvent: any, fnHandler: any): void;
    off(oRelQuery: any, sEvent: any, fnHandler: any): void;
    fire(sEvent: any, oWidget: any): void;
    /**
     * добавление данных в отдельный индекс
     * хранящий привязку виджет => обработчики событий
     * чтобы при удалении виджета, удалять все обработчики
     * @param {IRelQuery} oRelQuery
     * @param {string} sEvent
     * @param {function} fnHandler
     */
    _saveWidgetEventMap(oRelQuery: IRelQuery, sEvent: string, fnHandler: Function): void;
    /**
     * очистка обработчиков событий, при удалении виджета
     * @param {IWidget} oWidget
     */
    _cleanWidgetHandlers(oWidget: IWidget): void;
    _canEmptyCheck(aRet: any, oRelQuery: any): any;
    reindex(eContext: any, bWithSelf?: boolean): void;
    _widgetsFromMap(aBlocks: any, aBlockIds: any, cWidget: any, bOnlyFirst: any): any[];
    /**
     * непосредственно метод поиска элементов в DOM
     * @param {Element} eContext откуда начинаем
     * @param {string} sWay направление
     * @param {boolean} bWithSelf захватываем eContext в выборку?
     * @param {string[]} aBlockIds массив названий виджетов
     * @param {string} sSelector дополнительный фильтрующий селектор
     * @return {Element[]}
     * @private
     */
    private _findBlocks;
    /**
     * @param {IWidget} oWidget
     * @param {string} sBlockId
     * @private
     */
    private _addToIndex;
    _dropFromIndex(oWidgets: any): void;
    _getWidgetsByIndex(aBlockIds: any, aIndex: any): any[];
    checkWidget(oWidget: any, oRelQuery: any): any;
    /**
     * достать из хранилища все blockId привязаные к классу виджета
     * @param cWidget
     * @returns {String[]}
     */
    _getBlockIdsByWidgetClass(cWidget: any): string[];
    /**
     * добавить в хранилище привязку класса виджета и blockId
     * @param cWidget
     * @param sBlockId
     */
    addBlockIdWidgetClassRel(cWidget: any, sBlockId: any): void;
}
export type IStorageInit = import("../interfaces").IStorageInit;
export type IDom = import("../interfaces").IDom;
export type IRelQuery = import("../interfaces").IRelQuery<import("../interfaces").IWidget>;
export type IWidget = import("../interfaces").IWidget;

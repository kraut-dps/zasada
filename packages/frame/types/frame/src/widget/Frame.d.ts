/**
 * Фрейм, контейнер html, c методами для обновления данных
 */
export class Frame extends Widget {
    constructor(eBlock: Element, sBlockId: string);
    /**
     * @type {boolean} можно ли при переходе по новой ссылке обновлять контент по кешу, если url совпадает?
     */
    bCache: boolean;
    /**
     * @type {number} максимальное количество элементов в кеше готовых контейнеров
     */
    iCacheLen: number;
    /**
     * @type {boolean} можно ли при переходе по новой ссылке доставать контент,
     * который предварительно загружен через aPreloadUrls
     */
    bPreload: boolean;
    /**
     * @type {boolean} нужно ли делать scrollTop после обновления фрейма?
     */
    bScroll: boolean;
    /**
     * @type {string} текущий url у фрейма
     */
    sUrl: string;
    /**
     * @type {null|boolean} если null, то POST http запрос будет если будет oFormData
     */
    bPost: null | boolean;
    /**
     * @type {object} данные фрейма
     */
    oCustomData: object;
    /**
     * @type {string[]} массив ссылок для предзагрузки
     */
    aPreloadUrls: string[];
    _oPreloads: {};
    _sFrameId: any;
    _bPreloadNow: boolean;
    _oCache: {};
    _oUrlStateIdRel: {};
    _oXhr: any;
    _iStateId: number;
    /**
     * @type {number} указатель на следующий свободный state
     */
    _iStateIdNextId: number;
    /**
     * @type {Promise} внутренний Promise
     */
    _oPromise: Promise<any>;
    /**
     * @type {function[]} массив функций resolve фрейма
     */
    _aResolve: Function[];
    /**
     * @type {function[]} массив функций reject фрейма
     */
    _aReject: Function[];
    _iLastTime: any;
    newXhr: any;
    oneStorage: any;
    update(oOpts: any): Promise<any>;
    reload(): Promise<any>;
    url(): string;
    stateId(): number;
    customData(): any;
    /**
     * возможность использовать Frame как deferred объект
     * сработает resolve при json ответе сервера
     */
    promise(): Promise<any>;
    resolve(mValue: any): void;
    reject(mValue: any): void;
    preloadUrls(aPreloadUrls: any): void;
    _updateFromCache(oOpts: any): any;
    _getData(oOpts: any): Promise<any>;
    _afterUpdate(oOpts: any, sNewUrl?: any): number;
    _scroll(oOpts: any, sHash: any): void;
    /**
     * @param {any} oResponse
     * @return {Promise<any>}
     */
    _updateBody(oResponse: any): Promise<any>;
    _fetch(oOpts: any): Promise<any>;
    _onStateChange(fnResolve: any, fnReject: any): void;
    _xhrSend(oOpts: any): void;
    _addHeaders(oOpts: any): void;
    _saveState(iStateId: any): void;
    hasState(iStateId: any): boolean;
    toState(iStateId: any): boolean;
    _gcCache(): void;
    _moveChilds(eOldParent: any, eNewParent: any): void;
    _prepareOpts(oOptsCustom: any): {
        bPost: boolean;
        sUrl: any;
    };
    _preloadFetch(): void;
    _preloadSave(sPreloadUrl: any, oResponse: any): void;
    _parseXhr(oXhr: any): {
        sHtml: string;
        sUrl: any;
        oJson: any;
    };
    _getTime(): number;
    getHistoryState(): number;
    toHistoryState(iStateId: any): boolean;
    _absUrl(sUrl: any): any;
    getFrameId(): any;
}
import { Widget } from "@zasada/widget";

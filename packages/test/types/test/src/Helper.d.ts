/**
 * @typedef {import('./interfaces').IHelper} IHelper
 */
/**
 * небольшой вспомогательный класс для организации тестов
 * @implements IHelper
 */
export class Helper implements IHelper {
    oneLinker: any;
    _eContext: any;
    /**
     * @deprecated
     * use addHtml*
     */
    addHtml(sHtml: any): Promise<any[]>;
    /**
     * @param {string} sHtml
     * @return {Promise<any[]>[]}
     */
    addHtmlPromises(sHtml: string): Promise<any[]>[];
    /**
     * @param {string} sHtml
     * @return {Promise<any[]>}
     */
    addHtmlAll(sHtml: string): Promise<any[]>;
    /**
     * @param {string} sHtml
     * @return {Promise<any[]>}
     */
    addHtmlAllSettled(sHtml: string): Promise<any[]>;
    destroy(): void;
    element(sSelector: any): any;
    widget(sSelector: any, cWidget: any): any;
    getRejectResults(aResults: any): any;
}
export type IHelper = import("./interfaces").IHelper;

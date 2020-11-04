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
    addHtml(sHtml: any): any;
    destroy(): void;
    element(sSelector: any): any;
    widget(sSelector: any, cWidget: any): any;
}
export type IHelper = import("./interfaces").IHelper;

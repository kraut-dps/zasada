/**
 * @typedef {import('./interfaces').ICustomError} ICustomError
 * @typedef {import('../../core/src/interfaces').IWidget} IWidget
 */
/**
 * расширенный класс ошибки, чтобы иметь больше данных для разбирательств
 * @implements ICustomError
 */
export class CustomError implements ICustomError {
    message: string;
    name: string;
    stack: string;
    /**
     * @type {string} error help code
     */
    sHelp: string;
    /**
     * @type {any} origin exception
     */
    mOrigin: any;
    /**
     * @type {IWidget}
     */
    oWidget: IWidget;
    /**
     * @type {Element}
     */
    eContext: Element;
    /**
     * @type {string}
     */
    sBlockId: string;
    /**
     * @type {string}
     */
    sStackMapped: string;
    /**
     * @type {boolean|null}
     */
    bSkipLog: boolean | null;
    errorOrigin(): any;
    msg(): any;
    help(): string;
    blockId(): string;
    stackOrigin(): string;
    setStackMapped(sStackMapped: any): void;
    stackMapped(): string;
    context(): Element;
    contextHtml(iSubStr?: number): string;
    widget(): import("../../core/src/interfaces").IWidget;
    widgetClass(): string;
    skipLog(): any;
}
export type ICustomError = import("./interfaces").ICustomError;
export type IWidget = import("../../core/src/interfaces").IWidget;

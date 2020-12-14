/**
 * @typedef {import('./../interfaces').ILinker} ILinker
 * @typedef {import('./../interfaces').ILinkerInit} ILinkerInit
 * @typedef {import('./../interfaces').ILinkerOpts} ILinkerOpts
 * @typedef {import('./../interfaces').ILinkerClasses} ILinkerClasses
 * @typedef {import('./../interfaces').IRelQuery} IRelQuery
 * @typedef {import('./../interfaces').IWidget} IWidget
 * @typedef {import('./../interfaces').IWidgetConstructor} IWidgetConstructor
 * @typedef {import('./../interfaces').IDom} IDom
 * @typedef {import('./../interfaces').IStorage} IStorage
 * @typedef {import('./../interfaces').ICustomErrorProps} ICustomErrorProps
 * @typedef {import('./../../../log/src/interfaces').ICustomError} ICustomError
 */
/**
 * основной класс связывающий {Element} с виджетами
 * @implements ILinkerInit
 */
export class Linker implements ILinkerInit {
    /**
     * @type {function(Element, string, IWidgetConstructor ): IWidget}
     */
    newWidget: (arg0: Element, arg1: string, arg2: IWidgetConstructor) => IWidget;
    /**
     * @type {function( Partial<ICustomErrorProps> ): ICustomError}
     */
    newError: (arg0: Partial<ICustomErrorProps>) => ICustomError;
    /**
     * @type {function(): IRelQuery}
     */
    newRelQuery: () => IRelQuery;
    /**
     * @type {function(): IStorage}
     */
    oneStorage: () => IStorage;
    /**
     * @type {function(): IDom}
     */
    oneDom: () => IDom;
    /**
     * @type {function( object, object ): void }
     */
    fnMergeDeep: (arg0: object, arg1: object) => void;
    /**
     * @type {function( object|array, ...object ): object }
     */
    fnDeepKey: (arg0: object | any[], ...args: object[]) => object;
    fnAssertUndefProps: any;
    _oOpts: {};
    _oImports: {};
    /**
     * установка опций виджетов
     * @param {ILinkerOpts} oOpts
     */
    setOpts(oOpts: ILinkerOpts): void;
    /**
     * установка классов виджетов
     * @param {ILinkerClasses} oClasses
     */
    setWidgets(oClasses: ILinkerClasses): void;
    /**
     * установка callback методов перед созданием виджетов
     * пример использования, подзагрузка с сервера виджетов по названию
     * @param {array} aBlockIds
     * @param {function} fnBeforeNew
     */
    setBeforeNew(aBlockIds: any[], fnBeforeNew: Function): void;
    setImports(oDynamicImports: any): void;
    getImport(sImportName: any, sBlockId: any): any;
    /**
     * связывание Element
     * @param {Element} eContext
     * @param {boolean} bWithSelf
     * @return {Promise<any[]>[]}
     */
    link(eContext: Element, bWithSelf?: boolean): Promise<any[]>[];
    unlink(eContext: any, bWithSelf: any): void;
    widget(eContext: any, sBlockId: any, oCustomOpts?: any): Promise<any>;
    _setProps(oWidget: any, oProps: any): void;
}
export type ILinker = import("../interfaces").ILinker;
export type ILinkerInit = import("../interfaces").ILinkerInit;
export type ILinkerOpts = import("../interfaces").ILinkerOpts;
export type ILinkerClasses = import("../interfaces").ILinkerClasses;
export type IRelQuery = import("../interfaces").IRelQuery<import("../interfaces").IWidget>;
export type IWidget = import("../interfaces").IWidget;
export type IWidgetConstructor = import("../interfaces").IWidgetConstructor;
export type IDom = import("../interfaces").IDom;
export type IStorage = import("../interfaces").IStorage;
export type ICustomErrorProps = import("../interfaces").ICustomErrorProps;
export type ICustomError = import("../../../log/src/interfaces").ICustomError;

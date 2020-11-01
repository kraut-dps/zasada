/**
 * @typedef {import('./../interfaces').IWidget} IWidget
 * @typedef {import('./../interfaces').ILinker} ILinker
 * @typedef {import('./../interfaces').IAttrs} IAttrs
 * @typedef {import('./../interfaces').IEl} IEl
 * @typedef {import('./../interfaces').IElQuery} IElQuery
 * @typedef {import('./../interfaces').IRelQuery} IRelQuery
 * @typedef {import('./../interfaces').ICustomError} ICustomError
 * @typedef {import('./../interfaces').TContext} TContext
 */
/**
 * виджет
 * @implements IWidget
 */
export class CoreWidget implements IWidget {
    /**
     * @param {Element} eBlock DOM элемент основного узла виджета
     * @param {string} sBlockId строковый инедтификатор типа виджета
     */
    constructor(eBlock: Element, sBlockId: string);
    __eBl: Element;
    __sId: string;
    __sIdx: any;
    /**
     * @type {function(): ILinker}
     */
    oneLinker: () => ILinker;
    /**
     * @type {function(): IAttrs}
     */
    oneAttrs: () => IAttrs;
    /**
     * @type {function(): IEl}
     */
    oneEl: () => IEl;
    /**
     * @type {function( object ): ICustomError}
     */
    newError: (arg0: object) => ICustomError;
    /**
     * @return {Promise<any> | void}
     */
    run(): Promise<any> | void;
    attach(): void;
    detach(): void;
    /**
     * DOM элемент основного узла виджета
     * @return {Element}
     */
    bl(): Element;
    /**
     * строковый идентификатор типа виджета
     * @return {string}
     */
    blockId(): string;
    /**
     * поиск элемента виджета
     * @param {string|IElQuery} mQuery
     * @return {Element|Element[]}
     */
    _el(mQuery: string | IElQuery): Element | Element[];
    /**
     * выборка других виджетов
     * @example
     * ._rel().child().typeOf( WidgetClass ).find()
     *
     * @example
     * ._rel().parent().typeOf( WidgetClass ).find()
     *
     * @example
     * ._rel().index( 'index' ).find()
     *
     * @example
     * ._rel().typeOf( WidgetClass ).onAdd( fnHandler: ( IWidget, sEvent, IRelQuery ) )
     *
     * @param {string|Element|Element[]} mContext
     * @return {IRelQuery}
     */
    _rel(mContext?: string | Element | Element[]): IRelQuery;
    /**
     * @param {TContext} mContext
     * @param {string} sEvent
     * @param {function(Event):any} fnHandler
     */
    _on(mContext: TContext, sEvent: string, fnHandler: (arg0: Event) => any): void;
    /**
     * @param {string|Element|Element[]} mContext
     * @param {string} sEvent
     * @param {function} fnHandler
     */
    _off(mContext: string | Element | Element[], sEvent: string, fnHandler: Function): void;
    /**
     * fire CustomEvent
     * @param {string|Element|Element[]} mContext
     * @param {string} sEvent название события
     * @param {any} mData данные события
     */
    _fire(mContext: string | Element | Element[], sEvent: string, mData?: any): boolean;
    /**
     * изменить css класс
     * @example
     * ._mod( '', 'new_class', true )
     *
     * @example
     * ._mod( '', [ 'new_class1', 'new_class2' ], 'new_class1' )
     *
     * @example
     * ._mod( '', { one: 'new_class1', two: 'new_class2' ], 'one' )
     *
     * @param {string|Element|Element[]} mContext
     * @param {string|array|object} mMod
     * @param {boolean|string} mValue
     */
    _mod(mContext: string | Element | Element[], mMod: string | any[] | object, mValue: boolean | string): void;
    /**
     * получить значение DOM Element атрибута
     *
     * @example
     * ._attr( '', 'var' )
     *
     * @example
     * ._attr( '', 'i:var' ) // with integer cast i - int, b - bool, ... {@link Attrs.oCasts}
     *
     * @param {string|Element|Element[]} mContext
     * @param {string} sAttr
     * @param {string|null} sAttrPrefix
     */
    _attr(mContext: string | Element | Element[], sAttr: string, sAttrPrefix?: string | null): any;
    /**
     * получить значения DOM Element атрибутов
     *
     * @example
     * ._attrs( '', { key1: 'i:attr1', key2: 'b:attr2' } ) // cast i - int, b - bool, ... {@link Attrs.oCasts}
     *
     * @param {string|Element|Element[]} mContext
     * @param {array[]|string[]|object} mMap
     * @param {string|null} sAttrPrefix
     */
    _attrs(mContext: string | Element | Element[], mMap: any[][] | string[] | object, sAttrPrefix?: string | null): any;
    /**
     * получить значения DOM Element атрибутов и поместить их в свойства виджета
     *
     * @example
     * ._my( { prop1: 'i:attr1', prop2: 'b:attr2' } ) // cast i - int, b - bool, ... {@link Attrs.oCasts}
     * @param {array|object} mMap
     * @param {string|null} sAttrPrefix
     */
    _my(mMap: any[] | object, sAttrPrefix?: string | null): void;
    /**
     * запустить привязку виджетов к контексту
     * @param {string|Element|Element[]} mContext
     * @param {boolean} bWithSelf включая DOM элемент контекста?
     * @return {Promise<any[]>}
     */
    _link(mContext: string | Element | Element[], bWithSelf: boolean): Promise<any[]>;
    /**
     * отвязать виджеты от контекста
     * @param {string|Element|Element[]} mContext
     * @param {boolean} bWithSelf включая DOM элемент контекста?
     */
    _unlink(mContext: string | Element | Element[], bWithSelf: boolean): void;
    /**
     * динамическое создание виджета
     */
    _widget(eContext: any, sBlockId: any, oCustomOpts?: any): Promise<any[]>;
    /**
     * обертка Element.innerHTML и Element.insertAdjacentHTML для динамического изменения HTML
     * @param {string|Element|Element[]} mContext
     * @param {string} sHtml
     * @param {null|InsertPosition} sInsertPosition for { @link Element.insertAdjacentHTML }
     * @return {Promise<any[]>}
     */
    _html(mContext: string | Element | Element[], sHtml: string, sInsertPosition?: null | InsertPosition): Promise<any[]>;
    /**
     * достать promise с импортом из глобального хранилища
     * @param {string} sImportName
     * @return {Promise<any[]>}
     */
    _import(sImportName: string): Promise<any[]>;
    /**
     * @param {any} mContext
     * @return {Element[]}
     */
    _context(mContext: any): Element[];
    /**
     * сброс кеша с найдеными элементами
     */
    _elReset(): void;
    /**
     * возможность обернуть обработчик, чтобы обогатить Error, добавить в него объект виджета
     * @param {any} fnHandler
     * @return {any}
     */
    _wrapError(fnHandler: any): any;
    _oWrapHandlers: WeakMap<object, any>;
    index(): any;
    _getIndex(): any;
    destructor(): void;
}
export type IWidget = import("../interfaces").IWidget;
export type ILinker = import("../interfaces").ILinker;
export type IAttrs = import("../interfaces").IAttrs;
export type IEl = import("../interfaces").IEl;
export type IElQuery = import("../interfaces").IElQuery;
export type IRelQuery = import("../interfaces").IRelQuery<import("../interfaces").IWidget>;
export type ICustomError = import("../interfaces").ICustomError;
export type TContext = string | Element | Element[];

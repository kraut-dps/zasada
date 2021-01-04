declare type constructor<T> = {
    new (...args: any[]): T;
};
export declare type TContext = string | Element | Element[];
declare type TWay = "parent" | "child" | "prev" | "next" | "self";
export interface IAttrs {
    parse(aElements: Element[], mMap: (string | object | [][]), sPrefix?: string): any;
}
export interface IAttrsInit extends IAttrs {
    newError: (oError: ICustomErrorProps) => any;
}
export interface IAttrsConstructor {
    new (...args: string[]): IAttrsInit;
}
export interface IDom {
    children(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];
    parents(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];
    nexts(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];
    prevs(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];
    parseBlockIds(eContext: Element): string[];
    sel(sBlockId?: string, sElementId?: string): string;
}
export interface IDomConstructor {
    new (...args: string[]): IDom;
}
export interface IEl {
    find(oWidget: IWidget, mQuery: (string | IElQuery)): Element[] | Element | null;
    parse(sEl: string): IElQuery;
    resetCache(oWidget: IWidget): void;
}
export interface IElInit extends IEl {
    newError: (oError: ICustomErrorProps) => any;
    newElQuery: (sEl: any) => IElQuery;
    oneDom: () => IDom;
}
export interface IElConstructor {
    new (...args: string[]): IElInit;
}
export interface IElQuery {
    parse(sQuery: string): void;
    key(): string;
    getId(): string;
    /**
     * @param {boolean} bWithFrom
     * @return {IElQuery|this}
     */
    withFrom(bWithFrom: boolean): IElQuery;
    isWithFrom(): boolean;
    canEmpty(bCanEmpty: boolean): IElQuery;
    isCanEmpty(): boolean;
    onlyFirst(bOnlyFirst: boolean): IElQuery;
    isOnlyFirst(): boolean;
    noCache(bNoCache: boolean): IElQuery;
    isNoCache(): boolean;
}
export interface IElQueryInit extends IElQuery {
    newError: (oError: ICustomErrorProps) => any;
}
export interface IElQueryConstructor {
    new (sQuery: string): IElQueryInit;
}
export interface IRelQueryStruct {
    eFrom: Element;
    bWithFrom: boolean;
    sWay: TWay;
    bOnlyFirst: boolean;
    cTypeOf: IWidgetConstructor;
    aBlockIds: string[];
    aIndex: string[];
    sCssSel: string;
}
export interface IRelQuery<T = IWidget> {
    blockId(sBlockId: string): IRelQuery<T>;
    blockId(aBlockIds: string[]): IRelQuery<T>;
    parent(): IRelQuery<T>;
    child(): IRelQuery<T>;
    next(): IRelQuery<T>;
    prev(): IRelQuery<T>;
    self(): IRelQuery<T>;
    from(eFrom?: Element): IRelQuery<T>;
    withFrom(bWithFrom?: boolean): IRelQuery<T>;
    cssSel(sCssSel: string): IRelQuery<T>;
    index(sIndex: string): IRelQuery<T>;
    index(aIndex: string[]): IRelQuery<T>;
    canEmpty(bCanEmpty?: boolean): IRelQuery<T>;
    onlyFirst(bOnlyFirst?: boolean): IRelQuery<T>;
    typeOf<T>(cTypeOf: constructor<T>): IRelQuery<T>;
    find(bAll: false): T;
    find(bAll: true): T[];
    find(bAll: null): T;
    getQuery(): IRelQueryStruct;
    onAdd(fnHandler: (oWidget: T, sEvent: string) => void): IRelQuery<T>;
    onDrop(fnHandler: (oWidget: T, sEvent: string) => void): IRelQuery<T>;
    widget(oWidget: IWidget): IRelQuery<T>;
    getWidget(): IWidget;
}
export interface IRelQueryInit extends IRelQuery {
    oneStorage: () => IStorage;
}
export interface IRelQueryConstructor {
    new (): IRelQueryInit;
}
export interface IStorage {
    add(oWidget: IWidget): void;
    drop(eContext: Element, bWithSelf: boolean): IWidget[];
    find(oRelQuery: IRelQuery): IWidget[];
    fire(sEvent: string, oWidget: IWidget): void;
    on(oRelQuery: IRelQuery, sEvent: string, fnHandler: () => any): any;
    off(oRelQuery: IRelQuery, sEvent: string, fnHandler: () => any): any;
}
export interface IStorageInit {
    oneDom: () => IDom;
    newError: (oError: ICustomErrorProps) => any;
}
export interface IStorageConstructor {
    new (): IStorageInit;
}
interface ILinkerOptsItem {
    cWidget?: IWidget;
    fnAfterNew?: (oWidget: IWidget, object: any) => any;
    fnBeforeRun?: (oWidget: IWidget) => boolean | void;
}
export interface ILinkerOpts {
    [sBlockId: string]: ILinkerOptsItem;
}
export interface ILinkerClasses {
    [sBlockId: string]: IWidgetConstructor;
}
export interface ILinker {
    newRelQuery(): IRelQuery;
    setOpts(oOpts: ILinkerOpts): void;
    setWidgets(oClasses: ILinkerClasses): void;
    setBeforeNew(aBlockIds: string[], fnBeforeNew: (object: any) => void): void;
    setImports(oDynamicImports: object): void;
    getImport(sImportName: string, sBlockId: string): () => Promise<any[]>;
    linkPromises(eContext: Element, bWithSelf?: boolean): Promise<any[]>[];
    link(eContext: Element, bWithSelf?: boolean): Promise<any[]>;
    unlink(eContext: Element, bWithSelf?: boolean): void;
    widget(eContext: Element, sBlockId: string, oCustomOpts: object | null): Promise<any[]>;
}
export interface ILinkerInit extends ILinker {
    newWidget: (eElement: Element, sBlockId: string, cClass: IWidgetConstructor) => IWidget;
    newError: (oError: ICustomErrorProps) => any;
    oneStorage: () => IStorage;
    oneDom: () => IDom;
    fnMergeDeep: (oTarget: any, oSource: any) => void;
    fnDeepKey: (mKeys: any | any[], ...aSources: object[]) => {};
    fnAssertUndefProps: (oObj: any) => void;
}
export interface ILinkerConstructor {
    new (): ILinkerInit;
}
export interface IPolyfills {
    base(fnCallback: () => void): void;
}
export interface IPolyfillsConstructor {
    new (): IPolyfills;
}
export interface ICustomErrorProps {
    message: string;
    name: string;
    stack: string;
    mOrigin: any;
    sHelp: string;
    oWidget: IWidget | null;
    eContext: Element | null;
    sBlockId: string;
    sStackMapped: string;
}
export interface IWidget {
    newError: (oError: ICustomErrorProps) => any;
    run(): Promise<any> | any | void;
    bl(): Element;
    blockId(): string;
    index(): string;
    destructor(): void;
}
export interface IWidgetInit extends IWidget {
    oneLinker: () => ILinker;
    oneAttrs: () => IAttrs;
    oneEl: () => IEl;
}
export interface IWidgetConstructor {
    new (eBlock: Element, sBlockId: string): IWidgetInit;
}
export {};

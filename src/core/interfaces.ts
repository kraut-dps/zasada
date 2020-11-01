declare type constructor<T> = {
	new (...args: any[]): T;
};

export type TContext = string | Element| Element[];

declare type TAttrMap = string[] | object;

type TWay = "parent" | "child" | "prev" | "next" | "self";

interface ICustomErrorProps {
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

export interface IAttrs {
	parse(aElements: Element[], mMap: (string | object | [][]), sPrefix?: string);
}
export interface IAttrsInit extends IAttrs {
	newError: ( oError: ICustomErrorProps ) => string;
}
export interface IAttrsConstructor {
	new(...args: string[]): IAttrsInit;
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
	new(...args: string[]): IDom;
}

export interface IEl {
	find( oWidget: IWidget, mQuery: (string|IElQuery )): Element[]|Element|null;
	parse( sEl: string): IElQuery;
	resetCache( oWidget: IWidget ): void;
}

export interface IElInit extends IEl{
	newError( oError: ICustomErrorProps ): ICustomError;
}
export interface IElConstructor {
	new(...args: string[]): IElInit;
}

export interface IElQuery {
	parse( sQuery: string ): void;
	key(): string;
	getId(): string;
	/**
	 * @param {boolean} bWithFrom
	 * @return {IElQuery|this}
	 */
	withFrom( bWithFrom: boolean ): IElQuery;
	isWithFrom(): boolean;
	canEmpty( bCanEmpty: boolean ): IElQuery;
	isCanEmpty(): boolean;
	onlyFirst( bOnlyFirst: boolean ): IElQuery;
	isOnlyFirst(): boolean;
	noCache( bNoCache: boolean ): IElQuery;
	isNoCache(): boolean;
}
export interface IElQueryConstructor {
	new( sQuery: string): IElQuery;
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

	find( bAll: false ): T;
	find( bAll: true ): T[];
	find( bAll: null ): T;

	getQuery(): IRelQueryStruct;

	onAdd( fnHandler: ( oWidget: T, sEvent: string ) => void ): IRelQuery<T>;

	onDrop( fnHandler: ( oWidget: T, sEvent: string ) => void ): IRelQuery<T>;

	widget( oWidget: IWidget ): IRelQuery<T>;
	getWidget(): IWidget;
}

export interface IStorage {
	add(oWidget: IWidget): void;

	drop(eContext: Element, bWithSelf: boolean): IWidget[];

	//query(): IRelQuery;

	find(oRelQuery: IRelQuery): IWidget[];

	on( oRelQuery: IRelQuery, sEvent: string, fnHandler: () => any );
	off( oRelQuery: IRelQuery, sEvent: string, fnHandler: () => any );
}


interface ILinkerOptsItem {
	//cWidget?: IWidgetConstructor;
	cWidget?: IWidget;
	fnAfterNew? : ( oWidget: IWidget, object ) => any;
	fnBeforeRun? : ( oWidget: IWidget ) => boolean | void;
}

export interface ILinkerOpts {
	[sBlockId: string]: ILinkerOptsItem;
}

export interface ILinkerClasses {
	[sBlockId: string]: IWidgetConstructor;
}

export interface ILinker {
	newRelQuery(): IRelQuery;
	setOpts( oOpts: ILinkerOpts ): void;
	setWidgets(oClasses: ILinkerClasses ): void;
	setBeforeNew( aBlockIds: string[], fnBeforeNew: ( object ) => void ): void;
	setImports( oDynamicImports: object ): void;
	getImport( sImportName: string, sBlockId: string ): () => Promise<any[]>;
	link( eContext: Element, bWithSelf?: boolean ): Promise<any[]>;
	unlink( eContext: Element, bWithSelf? : boolean ): void;
	widget( eContext: Element, sBlockId : string, oCustomOpts: object|null ): Promise<any[]>;
}

export interface IPolyfills {
	base( fnCallback: () => void ): void;
}

interface ILogRaw {
	mError: any;
	eContext: Element;
	sBlockId: string;
	oWidget: IWidget;
}

export interface ILogger {
	error( oLog: ILogRaw ): void;
}

interface ILogRoute {
	error( oError: ICustomError ): void;
}

interface ICustomErrorProps {
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

export interface ICustomError extends ICustomErrorProps{
	setStackMapped( sStackMapped: string ): void;
	errorOrigin(): any;
	msg(): string;
	help(): string;
	blockId(): string;
	stackOrigin(): string;
	stackMapped(): string;
	context(): Element | null;
	contextHtml( iSubStr: number ): string;
	widget(): IWidget | null;
	widgetClass(): string;
	skipLog(): boolean;
}

export interface IWidget {

	newError( oError: Partial<ICustomErrorProps> ): ICustomError | any;

	run(): Promise<any> | any | void;

	bl(): Element;

	blockId(): string

	index(): string;

	destructor(): void;

	/**
	 * поиск элемента виджета
	 */
	_el( mQuery: string | IElQuery ): Element|Element[];

	/**
	 * удаление из кеша найденного элемента
	 */
	_elReset(): void;

	_rel( mContext: TContext ): IRelQuery;

	_on( mContext: TContext, sEvent: string, fnHandler: ( oEvent: Event ) => void ): void;

	_off( mContext: TContext, sEvent: string, fnHandler: ( oEvent: Event ) => void ): void;

	_fire( mContext: TContext, sEvent: string, mData?: any ): boolean;

	_mod( mContext: TContext, mMod: string | string[] | object, mValue: string | boolean ): void;

	_attr( mContext: TContext, sAttr: string, sAttrPrefix?: string ): string | null;

	_attrs( mContext: TContext, mMap: TAttrMap, sAttrPrefix?: string ): object;

	_my( mMap: TAttrMap, sAttrPrefix?: string ): void;

	_link( mContext: TContext, bWithSelf?: boolean ): Promise<any>;

	_unlink( mContext: TContext, bWithSelf?: boolean ): void;

	_widget( eContext: Element, sBlockId: string, oCustomOpts: object | null ): Promise<any>;

	_html( mContext: TContext, sHtml: string, sInsertPosition?: InsertPosition ): Promise<any>;

	_import( sImportName: string ): Promise<any>;

	_context( mContext: TContext ): Element[];

	_wrapError( fnHandler: ( ...args: any[] ) => any ): ( ...args: any[] ) => any;

	_getIndex(): string;
}

export interface IWidgetConstructor {
	new( eBlock: Element, sBlockId: string ): IWidget;
}
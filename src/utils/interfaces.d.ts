declare type constructor<T> = {
	new (...args: any[]): T;
};

declare type TContext = string | Element| Element[];

declare type TAttrMap = string[] | object;

interface IPolyfills {
	base(fnCallback, fnReject) :void;
}

export interface IAttrs {
	parse(aElements: Element[], mMap: (string | object | [][]), sPrefix?: string);
}

interface IDom {
	children(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];

	parents(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];

	nexts(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];

	prevs(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];

	parseBlockIds(eContext: Element): string[];

	sel(sBlockId?: string, sElementId?: string): string;
}

interface IEl {
	find( oWidget: IWidget, mQuery: (string|IElQuery )): Element[]|Element|null;

	parse( sEl: string): IElQuery;

	resetCache( oWidget: IWidget ): void;
}

interface IElQuery {
	parse( sQuery: string ): IElQuery;
	key(): string;
}

interface IRelQuery<T = IWidget> {
	blockId(sBlockId: string): IRelQuery;

	blockId(aBlockIds: string[]): IRelQuery;

	parent(): IRelQuery;

	child(): IRelQuery;

	next(): IRelQuery;

	prev(): IRelQuery;

	self(): IRelQuery;

	from(eFrom?: Element): IRelQuery;

	withFrom(bWithFrom?: boolean): IRelQuery;

	cssSel(sCssSel: string): IRelQuery;

	index(sIndex: string): IRelQuery;

	index(aIndex: string[]): IRelQuery;

	canEmpty(bCanEmpty?: boolean): IRelQuery;

	onlyFirst(bOnlyFirst?: boolean): IRelQuery;

	typeOf<T>(cTypeOf: constructor<T>): IRelQuery<T>;

	find( bAll?: boolean ): (T | T[]);

	getQuery(): object;

	onAdd( fnHandler: ( oWidget: T, sEvent: string ) => void ): IRelQuery;

	onDrop( fnHandler: ( oWidget: T, sEvent: string ) => void ): IRelQuery;

	getWidget(): IWidget;

	widget( oWidget: IWidget ): IRelQuery;
}

interface IWidgetConstructor {
	new( eBlock: Element, sBlockId: string ): IWidget;
	readonly prototype: IWidget;
}

interface IStorage {
	add(oWidget: IWidget): void;

	drop(eContext: Element, bWithSelf: boolean): void;

	//query(): IRelQuery;

	find(oRelQuery: IRelQuery): IWidget[];
}


interface ILinkerOptsItem {
	//cWidget?: IWidgetConstructor;
	cWidget?: IWidget;
	fnAfterNew? : ( oWidget: IWidget, object ) => any;
	fnBeforeRun? : ( oWidget: IWidget ) => boolean | void;
}

interface ILinkerOpts {
	[sBlockId: string]: ILinkerOptsItem;
}

interface ILinkerClasses {
	//[sBlockId: string]: IWidgetConstructor;
	[sBlockId: string]: IWidget;
}

interface ILinker {
	setOpts( oOpts: ILinkerOpts ): void;
	setWidgets(oClasses: ILinkerClasses ): void;
	setBeforeNew( aBlockIds: string[], fnBeforeNew: ( object ) => void ): void;
	setImports( oDynamicImports: object ): void;
	link( eContext: Element, bWithSelf?: boolean ): Promise<any[]>;
	unlink( eContext: Element, bWithSelf? : boolean ): void;
	widget( eContext: Element, sBlockId : string, oCustomOpts: object|null ): Promise<any[]>;
}

interface ILogRaw {
	mError: any;
	eContext: Element;
	sBlockId: string;
	oWidget: IWidget;
}

interface ILogger {
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

interface ICustomError extends ICustomErrorProps{
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

/**
 * @see {import("../core/widget/CoreWidget.js")}
 */
interface IWidget {

	new( eBlock: Element, sBlockId: string ): IWidget;

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

	_wrapError( fnHandler: () => any ): () => any;

	_getIndex(): string;
}

/*interface ICoreBox{
	Attrs: constructor<IAttrs>;
	Dom: constructor<IDom>;
	El: constructor<IEl>;
	ElQuery: constructor<IElQuery>;
	Linker: constructor<ILinker>;
	Polyfills: constructor<IPolyfills>;
	Storage: constructor<IStorage>;
	RelQuery: constructor<IRelQuery>;

	deepKey: ( mKeys: any, ...aSources: any ) => any;
	mergeDeep: ( oTarget: object, oSource: object ) => void;
	oPolyfills: any;
}*/

interface IYo {
	boxHelp<ICoreBox>( Box: ICoreBox, oProps: Required<ICoreBox>): object;
}

export { IWidget as Widget };
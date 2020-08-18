interface IPolyfillBox {
	base(fnCallback, fnReject) :void;
}

interface IAttrs {
	parse(aElements: Element[], mMap: (string | object | [][]), sPrefix?: string);
}

interface IDom {
	children(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];

	parents(eContext: Element, sSel: string, bWithSelf: boolean, bOnlyFirst: boolean): Element[];

	parseBlockIds(eContext: Element): string[];

	sel(sBlockId?: string, sElementId?: string): string;
}

interface IEl {
	find( oWidget: IWidget, mQuery: (string|IElQuery )): Element[]|Element|null;

	parse( sEl: string): IElQuery;
}

interface IElQuery {
	parse( sQuery: string ): IElQuery;
	key(): string;
}

interface IRelQuery {
	blockId(sBlockId: string): IRelQuery;

	blockId(aBlockIds: string[]): IRelQuery;

	parents(eFrom?: Element, bWithFrom?: boolean): IRelQuery;

	children(eFrom?: Element, bWithFrom?: boolean): IRelQuery;

	from(eFrom?: Element): IRelQuery;

	withFrom(bWithFrom?: boolean): IRelQuery;

	cssSel(sCssSel: string): IRelQuery;

	index(sIndex: string): IRelQuery;

	index(aIndex: string[]): IRelQuery;

	canEmpty(bCanEmpty?: boolean): IRelQuery;

	onlyFirst(bOnlyFirst?: boolean): IRelQuery;

	typeOf(cTypeOf: any): IRelQuery;

	find( bAll?: boolean ): (IWidget | IWidget[]);
}

interface IWidget {
	bl(): Element;

	blId(): string

	destructor(): void;

	index(): string;

	run(): void;

	rel(bFromThis?: boolean): IRelQuery;
}

interface IWidgetConstructor {
	new( eBlock: Element, sBlockId: string ): IWidget;
	readonly prototype: IWidget;
}

interface IStorage {
	add(oWidget: IWidget): void;

	drop(eContext: Element, bWithSelf: boolean): void;

	query(): IRelQuery;

	find(oRelQuery: IRelQuery): IWidget[];
}


interface ILinkerOptsItem {
	cWidget?: IWidgetConstructor;
	fnAfterNew? : ( oWidget: IWidget, object ) => any;
	fnBeforeRun? : ( oWidget: IWidget ) => boolean | void;
}

interface ILinkerOpts {
	[sBlockId: string]: ILinkerOptsItem;
}

interface ILinkerClasses {
	[sBlockId: string]: IWidgetConstructor;
}

interface ILinker {
	setOpts( oOpts: ILinkerOpts ): void;
	setWidgets(oClasses: ILinkerClasses ): void;
	setBeforeNew( aBlockIds: string[], fnBeforeNew: ( object ) => void ): void;
	link( eContext: Element, bWithSelf?: boolean ): Promise<boolean>;
	unlink( eContext: Element, bWithSelf? : boolean ): void;
}

interface ILogRaw {
	mError: any;
	eContext: Element;
	sBlockId: string;
	oWidget: IWidget;
}

interface ILog {
	sError: string;
	sStack: string;
	sBlockId: string;
	eContext: Element;
	oWidget: IWidget;
}

interface ILogger {
	error( oLog: ILogRaw ): void;
}

interface ILogRoute {
	log( oOpts: ILog ): void;
}
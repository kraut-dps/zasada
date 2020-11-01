declare type constructor<T> = {
	new (...args: any[]): T;
};

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
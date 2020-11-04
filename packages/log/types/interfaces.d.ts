import { IWidget, ICustomErrorProps } from "@zasada/core/src/interfaces";
export interface ILogger {
    error(oError: Error | ICustomErrorProps | ICustomError): void;
}
interface IRouteTypes {
    [id: string]: ILogRouteConstructor;
}
export interface ILoggerInit extends ILogger {
    newError(oError: ICustomErrorProps): ICustomError;
    oRouteTypes: IRouteTypes;
    pMapStack: Promise<object>;
}
export interface ILoggerConstructor {
    new (): ILoggerInit;
}
export interface ILogRoute {
    error(oError: ICustomError): void;
}
export interface ILogRouteConstructor {
    new (): ILogRoute;
}
export interface ICustomError extends ICustomErrorProps {
    setStackMapped(sStackMapped: string): void;
    errorOrigin(): any;
    msg(): string;
    help(): string;
    blockId(): string;
    stackOrigin(): string;
    stackMapped(): string;
    context(): Element | null;
    contextHtml(iSubStr: number): string;
    widget(): IWidget | null;
    widgetClass(): string;
    skipLog(): boolean;
}
export interface ICustomErrorConstructor {
    new (): ICustomError;
}
export {};

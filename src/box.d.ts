import {IAttr} from "./help";

declare type constructor<T> = {
	new (...args: any[]): T;
};

interface ILogger {
	error( oLog: any ): void;
}

export class Attr1 implements ILogger{
	error( oLog: any ): void;
}

export const Logger: ILogger;

export function box<T>( Box: constructor<T>, oProps: Partial<T> );


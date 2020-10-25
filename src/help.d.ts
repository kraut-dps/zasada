declare type constructor<T> = {
	new (...args: any[]): T;
};

interface IAttr{
	do(): void;
}

export class help {
	boxHelp<T>( Box: constructor<T>, oProps: Partial<T> );
}

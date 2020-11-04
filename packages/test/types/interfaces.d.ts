import { IWidgetConstructor, IWidget, ILinker } from "@zasada/core/src/interfaces";
export interface IHelper {
    addHtml(sHtml: string): Promise<any>;
    destroy(): void;
    element(sSelector: string): Element;
    widget(sSelector: string, cWidget: IWidgetConstructor): IWidget;
}
export interface IHelperInit {
    oneLinker: () => ILinker;
}
export interface IHelperConstructor {
    new (): IHelperInit;
}

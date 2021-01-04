import { IWidgetConstructor, IWidget, ILinker } from "../../core/src/interfaces";
export interface IHelper {
    addHtmlPromises(sHtml: string): Promise<any>[];
    addHtmlAll(sHtml: string): Promise<any>;
    addHtmlAllSettled(sHtml: string): Promise<any>;
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

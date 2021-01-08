export { ILinker, IStorage, IRelQuery } from "../../core/src/interfaces";
import { IWidget, IStorage } from "../../core/src/interfaces";
export interface IRequest {
    exec(...args: any): any;
    optsMap(...args: any): any;
}
export interface IValidator {
}
export interface IHistoryAdapter {
}
export interface IBtn extends IWidget {
}
export interface IBtnInit extends IBtn {
    oneRequest: () => IRequest;
}
export interface IBtnConstructor {
    new (...args: string[]): IBtnInit;
}
export interface IForm extends IWidget {
    validate(bOnlyChanged: boolean): Promise<boolean>;
}
export interface IFormInit extends IForm {
    oneRequest: () => IRequest;
    newValidator: () => IValidator;
}
export interface IFormConstructor {
    new (...args: string[]): IFormInit;
}
export interface IFormField extends IWidget {
}
export interface IFormFieldInit extends IFormField {
    cForm: () => IFormConstructor;
}
export interface IFormFieldConstructor {
    new (...args: string[]): IFormFieldInit;
}
export interface IArea extends IWidget {
}
export interface IAreaInit extends IArea {
    oneRequest: () => IRequest;
}
export interface IAreaConstructor {
    new (...args: string[]): IAreaInit;
}
export interface ILayers extends IWidget {
}
export interface ILayersInit extends ILayers {
    sFrameBlockId: string;
    fnDeepKey: (mKeys: any | any[], ...aSources: object[]) => {};
}
export interface ILayersConstructor {
    new (...args: string[]): ILayersInit;
}
export interface ILayer extends IWidget {
}
export interface ILayerInit extends ILayer {
}
export interface ILayerConstructor {
    new (...args: string[]): ILayerInit;
}
export interface IFrame extends IWidget {
}
export interface IFrameInit extends IFrame {
    newXhr: () => XMLHttpRequest;
    oneStorage: () => IStorage;
}
export interface IFrameConstructor {
    new (...args: string[]): IFrameInit;
}
export interface IHistory extends IWidget {
}
export interface IHistoryInit extends IHistory {
    aPathParts: string[];
    oneHistoryAdapter: () => IHistoryAdapter;
}
export interface IHistoryConstructor {
    new (...args: string[]): IHistoryInit;
}

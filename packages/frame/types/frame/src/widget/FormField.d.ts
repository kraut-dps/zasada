/**
 * @typedef {import('./../interfaces').IForm} IForm
 */
export class FormField extends Widget {
    constructor(eBlock: Element, sBlockId: string);
    cForm: any;
    bOnChange: boolean;
    bOnType: boolean;
    sName: any;
    oMods: {
        process: string;
        success: string;
        error: string;
    };
    _bChanged: boolean;
    /**
     * @type {IForm}
     */
    _oFormWidget: IForm;
    onInputChange(oEvent: any): void;
    setChanged(): void;
    onInputKeyup(oEvent: any): void;
    /**
     * @param oData
     * @param bOnlyChanged
     */
    process(oData: any, bOnlyChanged: any): void;
    /**
     * @param oErrors
     * @param {Boolean} bOnlyChanged
     */
    update(oErrors: any, bOnlyChanged: boolean): any;
    /**
     * автоматическое определение названия
     * @returns {string}
     */
    _parseName(): string;
    /**
     * @param {HTMLInputElement} eInput
     * @return {IForm}
     */
    _getForm(eInput: HTMLInputElement): IForm;
}
export type IForm = import("../interfaces").IForm;
import { Widget } from "@zasada/widget";

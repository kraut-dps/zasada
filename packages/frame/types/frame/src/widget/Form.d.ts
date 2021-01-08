export class Form extends Widget {
    constructor(eBlock: Element, sBlockId: string);
    newValidator: any;
    /**
     * @var {function():Request}
     */
    oneRequest: any;
    oDefaultOpts: {};
    oMods: {
        process: string;
        success: string;
        error: string;
    };
    _oValidator: any;
    _onSubmit(oEvent: any): void;
    validate(bOnlyChanged: any): any;
    _parseOpts(eBtn: any, oEvent: any): any;
    _formOpts(oOpts: any): void;
    _exec(oEvent: any): void;
}
import { Widget } from "@zasada/widget";

/**
 * @typedef {import('./../interfaces').IRequest} IRequest
 */
export class Btn extends Widget {
    constructor(eBlock: Element, sBlockId: string);
    /**
     * @var {function():IRequest}
     */
    oneRequest: any;
    oDefaultOpts: {};
    _onClick(oEvent: any): void;
    _exec(eBtn: any, oEvent: any): void;
    _parseOpts(eBtn: any, oEvent: any): any;
}
export type IRequest = import("../interfaces").IRequest;
import { Widget } from "@zasada/widget";

/**
 * @typedef {import('./../interfaces').IRequest} IRequest
 */
export class Area extends Widget {
    constructor(eBlock: Element, sBlockId: string);
    /**
     * @type {function():IRequest}
     */
    oneRequest: () => IRequest;
    oDefaultOpts: {};
    /**
     * @type {string} если режим area, какой css match обрабатываем?
     */
    sMatch: string;
    _onClick(oEvent: any): boolean;
    _exec(eBtn: any, oEvent: any): void;
    _parseOpts(eBtn: any, oEvent: any): any;
}
export type IRequest = import("../interfaces").IRequest;
import { Widget } from "@zasada/widget";

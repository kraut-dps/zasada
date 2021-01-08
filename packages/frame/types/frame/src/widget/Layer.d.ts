export class Layer extends Widget {
    static C_NEAR_BTN_ABS: number;
    static C_NEAR_BTN_FIX: number;
    constructor(eBlock: Element, sBlockId: string);
    bPromise: any;
    oFrameOpts: any;
    sClassLayers: any;
    sClass: any;
    eBtn: any;
    iAlign: number;
    bDocClickHide: boolean;
    _fnDocClick: any;
    sFrameBlockId: any;
    sClassShow: string;
    sClassHide: string;
    sClassBack: string;
    sClassNone: string;
    _aClassesState: any[];
    _oLayers: any;
    _oPromise: any;
    _oFrame: any;
    /**
     * @param {number|null} mState 0 - active -x back, null - none
     */
    state(mState: number | null): void;
    reset(oOpts: any, oFrameOpts: any): any;
    frameUpdate(): any;
    promiseRenew(): void;
    resolve(mValue: any): void;
    reject(mValue: any): void;
    promise(): any;
    getClassLayers(): any;
    getUrl(): any;
    getFrameId(): any;
    setLayers(oLayers: any): void;
    align(bForce?: boolean): void;
    _calcRect(oBtnRect: any, eBlock: any, bBottom?: boolean, bRight?: boolean): {
        fLeft: any;
        fRight: any;
        fTop: any;
        fBottom: any;
    };
    addDocClickHide(): void;
    dropDocClickHide(): void;
}
import { Widget } from "@zasada/widget";

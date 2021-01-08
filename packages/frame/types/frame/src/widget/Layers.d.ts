export class Layers extends Widget {
    static DEFAULT: number;
    static FRAME: number;
    static OVERLAY: number;
    static STACK: number;
    constructor(eBlock: Element, sBlockId: string);
    sFrameBlockId: any;
    fnDeepKey: any;
    iNextId: number;
    _bShow: boolean;
    _oLayers: {};
    _aStack: any[];
    _aClassesFrame: any;
    _aClassesAvail: any[];
    sHistoryBlockId: string;
    sHistoryPart: string;
    show(oOpts?: {}): Promise<any>;
    hide(oOpts?: {}): void;
    _getLayer(oOpts: any): Promise<any>;
    /**
     * добавить/удалить необходимые классы css элементам
     * @param aOldStack
     */
    _modByStack(aOldStack?: any): void;
    _setVisible(): void;
    realign(): void;
    onResize(): void;
    getHistoryState(): {};
    toHistoryState(oState: any): void;
    _afterUpdate(): void;
    _frameOpts(oOpts: any): any;
    _layerOpts(oOpts: any): {
        bPromise: boolean;
        eBtn: any;
        sFrameBlockId: any;
    };
    _renewPromise(oFrame: any): void;
}
import { Widget } from "@zasada/widget";

export class History extends Widget {
    constructor(eBlock: Element, sBlockId: string);
    oneHistoryAdapter: any;
    aPathParts: any;
    oHashParts: {};
    _oMinorPartsReset: {};
    _oState: {};
    _oWidgets: {};
    _aStates: any[];
    _iStateId: any;
    registerFrame(oFrame: any): void;
    updatePath(sPartId: any, oWidget: any, sUrl: any, bReplace?: boolean): void;
    updateHash(sPartId: any, oWidget: any, bReplace?: boolean): void;
    _updateState(sUrl: any, bReplace?: boolean): void;
    _parseAnchor(): void;
    _genAnchor(): string;
    _onPopState(oEvent: any): void;
    _resetAnchor(): void;
}
import { Widget } from "@zasada/widget";

/**
 * @typedef {import('./../interfaces').IRelQuery} IRelQuery
 */
export class Request {
    /**
     * @type function():IRelQuery
     */
    newRelQuery: () => IRelQuery;
    cFrame: any;
    cLayers: any;
    fnDeepKey: any;
    optsMap(): {
        href: string;
        'data-url': string;
        'data-post': string;
        'data-cache': string;
        'data-confirm': string;
        'data-custom-data': string;
        'data-scroll': string;
        'data-layer': string;
        'data-popup': string;
        target: string;
        'data-target': string;
        'data-frame-id': string;
        'data-resolve-frame-id': string;
    };
    exec(oOpts: any, ...aMethods: any[]): boolean;
    disabled(oOpts: any): boolean;
    confirm(oOpts: any): boolean;
    urlBlank(oOpts: any): boolean;
    layer(oOpts: any): boolean;
    frame(oOpts: any): boolean;
    win(oOpts: any): void;
    _prepareOpts(oOpts: any): any;
    _resolveReload(sFrameId: any): any;
}
export type IRelQuery = import("@zasada/core/src/interfaces").IRelQuery<import("@zasada/core/src/interfaces").IWidget>;

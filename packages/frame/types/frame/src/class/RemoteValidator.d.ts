/**
 * @typedef {import('./../interfaces').IRelQuery} IRelQuery
 */
export class RemoteValidator {
    constructor(eForm: any);
    newXhr: any;
    /**
     * @type {function():IRelQuery}
     */
    newRelQuery: () => IRelQuery;
    cFormField: any;
    _eForm: any;
    _aFields: any;
    validate(bOnlyChanged: any): Promise<any>;
    _oXhr: any;
    _parseResponse(oXhr: any, bOnlyChanged: any): boolean;
    _fieldsProcess(oFormData: any, bOnlyChanged: any): void;
    _fieldsErrors(oErrors: any, bOnlyChanged: any): any[];
    _request(oXhr: any, oFormData: any, bOnlyChanged: any): void;
    _getFields(): any;
}
export type IRelQuery = import("@zasada/core/src/interfaces").IRelQuery<import("@zasada/core/src/interfaces").IWidget>;

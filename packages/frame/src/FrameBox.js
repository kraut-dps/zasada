import { Box } from "di-box";

/**
 * @typedef {import('./interfaces').ILinker} ILinker
 * @typedef {import('./interfaces').IStorage} IStorage
 * @typedef {import('./interfaces').IRelQuery} IRelQuery
 * @typedef {import('./interfaces').IBtnInit} IBtnInit
 * @typedef {import('./interfaces').IFormInit} IFormInit
 * @typedef {import('./interfaces').IFormFieldInit} IFormFieldInit
 * @typedef {import('./interfaces').IAreaInit} IAreaInit
 * @typedef {import('./interfaces').ILayersInit} ILayersInit
 * @typedef {import('./interfaces').IFrameInit} IFrameInit
 * @typedef {import('./interfaces').IHistoryInit} IHistoryInit
 * @typedef {import('./interfaces').IRequest} IRequest
 */

export class FrameBox extends Box {

	/**
	 * @type {function(): ILinker}
	 */
	oneLinker;

	/**
	 * @type {function(): IStorage}
	 */
	oneStorage;

	/**
	 * @type {function(): IRelQuery}
	 */
	newRelQuery;

	Area;
	Btn;
	Frame;
	Form;
	FormField;
	History;
	HistoryAdapter;
	Layer;
	Layers;
	RemoteValidator;
	Request;
	deepKey;

	init() {
		this._setWidgets();
		this._setOpts();
	}

	_setWidgets() {
		const { Area, Btn, Form, FormField, Frame, History, Layers, Layer } = this;
		this.oneLinker().setWidgets( {
			Area,
			Btn,
			Form,
			FormField,
			Frame,
			History,
			Layers,
			Layer
		} );
	}

	_setOpts() {
		this.oneLinker().setOpts( {
			Btn: {
				/** @param {IBtnInit} oWidget */
				fnAfterNew: ( oWidget ) => {
					oWidget.oneRequest = this.oneRequest;
				}
			},
			Form: {
				/** @param {IFormInit} oWidget */
				fnAfterNew: ( oWidget ) => {
					oWidget.oneRequest = this.oneRequest;
					oWidget.newValidator = this.newRemoteValidator;
				}
			},
			FormField: {
				/** @param {IFormFieldInit} oWidget */
				fnAfterNew: ( oWidget ) => {
					oWidget.cForm = this.Form;
				}
			},
			Area: {
				/** @param {IAreaInit} oWidget */
				fnAfterNew: ( oWidget ) => {
					oWidget.oneRequest = this.oneRequest;
				}
			},
			Layers: {
				/** @param {ILayersInit} oWidget */
				fnAfterNew: ( oWidget ) => {
					oWidget.sFrameBlockId = 'Frame';
					oWidget.fnDeepKey = this.deepKey;
				}
			},
			Frame: {
				/** @param {IFrameInit} oWidget */
				fnAfterNew: ( oWidget ) => {
					oWidget.newXhr = this.newXhr;
					oWidget.oneStorage = this.oneStorage;
				},
				/** @param {IFrameInit} oWidget */
				fnBeforeRun: ( oWidget ) => {
					// TODO ._rel() надо заменить на Storage.on(...)
					// @ts-ignore
					const oHistory = oWidget._rel()
						.parent()
						.canEmpty()
						.typeOf( this.History )
						.find();
					if( oHistory ) {
						oHistory.registerFrame( oWidget );
					}
				}
			},
			History: {
				/** @param {IHistoryInit} oWidget */
				fnAfterNew: ( oWidget ) => {
					oWidget.aPathParts = [ 'main' ];
					oWidget.oneHistoryAdapter = this.oneHistoryAdapter;
				}
			}
		} );
	}

	/**
	 * @type {function(): IRequest}
	 */
	oneRequest() {
		return this.one( this.newRequest );
	}

	newRequest() {
		const { Request, deepKey, Frame, Layers } = this;
		const oRequest = new Request();
		oRequest.newRelQuery = this.newRelQuery;
		oRequest.cFrame = Frame;
		oRequest.cLayers = Layers;
		oRequest.fnDeepKey = deepKey;
		return oRequest;
	};

	newRemoteValidator( eForm ) {
		const { RemoteValidator, FormField } = this;
		const oRemoteValidator = new RemoteValidator( eForm );
		oRemoteValidator.newXhr = this.newXhr;
		oRemoteValidator.newRelQuery = this.newRelQuery;
		oRemoteValidator.cFormField = FormField;
		//this._assertUndefProps( oRemoteValidator );
		return oRemoteValidator;
	};

	newXhr() {
		return new XMLHttpRequest();
	}

	oneHistoryAdapter() {
		return this.one( this.newHistoryAdapter );
	}

	newHistoryAdapter() {
		return new this.HistoryAdapter();
	}
}
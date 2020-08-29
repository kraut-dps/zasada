import { RouteString } from "zasada/src/log/route/RouteString.js";
import { RouteConsole } from "zasada/src/log/route/RouteConsole.js";
import oDeps from "zasada/tests/_support/deps.js";
import {RootBox, Widget} from "zasada/src/index.js";
import { Error as CustomError } from "zasada/src/log/Error.js";

let oRootBox, oHelper, oOriginConsole, fnSendSpy = jasmine.createSpy('spy');

class ErrorWidget extends Widget {

	static TYPE_ERROR = 1;
	static TYPE_COMPAT = 2;
	static TYPE_STRING = 3;
	static TYPE_REL_FROM_BAD = 4;

	iType = ErrorWidget.TYPE_ERROR;

	run() {

		this._my( { 'type': 'i:iType' } );

		switch( this.iType ) {
			case ErrorWidget.TYPE_ERROR:
				throw new Error( 'error origin' );
			case ErrorWidget.TYPE_COMPAT:
				throw { message: 'error object', sourceURL: 'sourceURL', line: 'line' };
			case ErrorWidget.TYPE_STRING:
				throw 'error string';
			case ErrorWidget.TYPE_REL_FROM_BAD:
				this.rel().from( 'bad' ).find();
		}
	}
}

/**
 * @implements ILogRoute
 */
class TestRouteString extends RouteString {
	_send( ...aArgs) {
		fnSendSpy( ...aArgs );
	}
}

/**
 * @implements ILogRoute
 */
class TestRouteConsole extends RouteConsole {
	_send( ...aArgs ) {
		fnSendSpy( ...aArgs );
	}
}


describe( "Routes", () => {

	beforeAll( ( fnDone ) => {
		oRootBox = new RootBox( oDeps );
		const oCoreBox = oRootBox.box( 'core' );
		oCoreBox.init( () => {
			// чтобы не заморачиваться на задержку обработки stackMap
			oRootBox.box( 'log' ).oneLogger().pMapStack = null;

			oCoreBox.oneLinker().setWidgets( { ErrorWidget } );
			oHelper = oRootBox.box( 'test' ).oneHelper();
			fnDone();
		} );
	} );

	beforeEach( () => {
		fnSendSpy.calls.reset();
		oRootBox.box( 'log' ).oneLogger().oRoutes = null;
	} );


	describe( "RouteString", () => {

		beforeAll( () => {
			oOriginConsole = window.console;
		} );

		afterAll( () => {
			window.console = oOriginConsole;
		} );

		it( "base", async ( fnDone ) => {

			oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteString() };

			fnSendSpy.and.callFake( ( sMessage, oData ) => {
				expect( oData.sMessage ).toEqual( 'error origin' );
				fnDone();
			} );

			await oHelper.addHtml(
				`<div class="_ _ErrorWidget"></div>`,
			);
		} );

		it( 'undefined widget', async ( fnDone ) => {
			oRootBox.box( 'log' ).oneLogger().oRoutes = {test: new RouteString() };
			window.console = { log: fnDone };
			await oHelper.addHtml(
				`<div class="_ _UndefinedWidget"></div>`,
			);
		} );

		it( 'long outerHTML', async ( fnDone ) => {
			oRootBox.box( 'log' ).oneLogger().oRoutes = {test: new RouteString() };
			window.console = { log: ( sMessage ) => {
				expect(sMessage.indexOf('...') !== -1).toBe(true);
				fnDone();
			} };
			const s100Len = "1".repeat(100);
			await oHelper.addHtml(
				`<div class="_ _UndefinedWidget" data="${s100Len}"></div>`,
			);
		} );

		it( 'Error without name', async ( fnDone ) => {
			oRootBox.box( 'log' ).oneLogger().oRoutes = {test: new RouteString() };
			window.console = { log: ( sMessage ) => {
				expect(sMessage.indexOf('#') !== -1).toBe(false);
				fnDone();
			} };
			await oHelper.addHtml(
				`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_REL_FROM_BAD}"></div>`,
			);
		} );
	} );

	describe( "RouteConsole", () => {

		beforeAll( () => {
			oOriginConsole = window.console;
		} );

		afterAll( () => {
			window.console = oOriginConsole;
		} );

		it( 'no blockId and widget', async ( fnDone ) => {

			// null, но на самом деле из дефолтного конфига возьмет RouteConsole
			oRootBox.box( 'log' ).oneLogger().oRoutes = null;

			window.console = { error: () => {
				window.console = oOriginConsole;
				fnDone();
			} };
			await oHelper.addHtml(
				`<div class="_"></div>`,
			);

		} );

		it( 'undefined widget console', async ( fnDone ) => {
			oRootBox.box( 'log' ).oneLogger().oRoutes = {test: new RouteConsole() };
			window.console = { error: () => {
				window.console = oOriginConsole;
				fnDone();
			} };
			await oHelper.addHtml(
				`<div class="_ _UndefinedWidget"></div>`,
			);
		} );

		it( 'throw string', async ( fnDone ) => {

			oRootBox.box( 'log' ).oneLogger().oRoutes = {test: new RouteConsole()};

			class ThrowWidget extends Widget {
				run() {
					throw "exception";
				}
			}
			oRootBox.box( 'core' ).oneLinker().setWidgets( { ThrowWidget } );
			window.console = { error: () => {
				window.console = oOriginConsole;
				fnDone();
			} };
			await oHelper.addHtml(
				`<div class="_ _ThrowWidget"></div>`,
			);
		} );

	} );

	it( "type compat", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteConsole() };

		fnSendSpy.and.callFake( ( sMessage, oData ) => {
			expect( oData.sMessage ).toEqual( 'error object' );
			fnDone();
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_COMPAT}"></div>`,
		);
	} );

	it( "type pure error", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteConsole() };

		fnSendSpy.and.callFake( ( sMessage, oData ) => {
			expect( oData.sMessage ).toEqual( 'error custom origin' );
			fnDone();
		} );

		throw new CustomError( 'error custom origin' );
	} );

	it( "type error", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteConsole() };

		fnSendSpy.and.callFake( ( sMessage, oData ) => {
			expect( oData.sMessage ).toEqual( 'error origin' );
			fnDone();
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_ERROR}"></div>`,
		);
	} );

	it( "type string", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteConsole() };

		fnSendSpy.and.callFake( ( sMessage, oData ) => {
			expect( oData.sMessage ).toEqual( 'error string' );
			fnDone();
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_STRING}"></div>`,
		);
	} );

	it( "mapStack lib error", async ( fnDone ) => {

		// ситуация, когда по какой то причине вместо подгрузки sourcemapped-stacktrace библиотеки
		// произошла ошибка
		oRootBox.box( 'log' ).oneLogger().pMapStack = () => {
			throw "error";
		};
		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteString() };

		fnSendSpy.and.callFake( ( sMessage ) => {
			oRootBox.box( 'log' ).oneLogger().pMapStack = oDeps.log.pMapStack;
			fnDone();
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget"></div>`,
		);
	} );

	it( "unset route by name", () => {

		const oLogger = oRootBox.box( 'log' ).oneLogger();

		// изначально был задан тип
		oLogger.oRouteTypes = { test: RouteConsole };
		// потом его сбросили
		oLogger.oRouteTypes = { test: false };
		// нужно чтобы по новой Logger собрал oRoutes
		oLogger.oRoutes = null;

		expect( oLogger._getRoutes() ).toEqual({  } );
	} );

	it( "MapStack", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteString() };
		oRootBox.box( 'log' ).oneLogger().pMapStack = oRootBox.box( 'log' ).pMapStack;

		fnSendSpy.and.callFake( ( sMessage, oData ) => {
			expect( oData.sMessage ).toEqual( 'error origin' );
			fnDone();
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget"></div>`,
		);

	} );
} );
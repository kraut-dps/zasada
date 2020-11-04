import oDeps from "./../_support/deps.js";
import {RootBox} from "di-box";
import { RouteString } from "../../packages/log/src/route/RouteString.js";
import {ErrorWidget} from "./../_support/ErrorWidget.js";
import {CustomError} from "../../packages/log/src/CustomError.js";

let oRootBox, oHelper, oOriginConsole, fnSendSpy = jasmine.createSpy('spy');

/**
 * @implements ILogRoute
 */
class TestRouteString extends RouteString {
	_send( ...aArgs) {
		fnSendSpy( ...aArgs );
	}
}

describe( "RouteString", () => {

	beforeAll( ( fnDone ) => {
		oOriginConsole = window.console;
		oRootBox = new RootBox( oDeps );
		oRootBox.box( 'log' ).init();
		const oCoreBox = oRootBox.box( 'core' );
		oCoreBox.init( () => {
			// чтобы не заморачиваться на задержку обработки stackMap
			oRootBox.box( 'log' ).oneLogger().pMapStack = null;

			oCoreBox.oneLinker().setWidgets( { ErrorWidget } );
			oHelper = oRootBox.box( 'test' ).oneHelper();
			fnDone();
		} );
	} );

	afterAll( () => {
		window.console = oOriginConsole;
	} )

	beforeEach( () => {
		fnSendSpy.calls.reset();
		oRootBox.box( 'log' ).oneLogger().oRoutes = null;
	} );


	it( "simple", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteString() };

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error origin' );
			fnDone();
		} );

		throw new Error( 'error origin' );
	} );

	it( 'undefined widget', async ( fnDone ) => {
		oRootBox.box( 'log' ).oneLogger().oRoutes = {test: new RouteString() };
		window.console = { log: fnDone };
		await oHelper.addHtml(
			`<div class="_ _UndefinedWidget"></div>`,
		);
	} );

	it( 'long outerHTML', async ( fnDone ) => {
		oRootBox.box( 'log' ).oneLogger().oRoutes = {test: new TestRouteString() };

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect(sMessage.indexOf('...') !== -1).toBe(true);
			oError.contextHtml( 101 );
			fnDone();
		} );

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

	it( "onunhandledrejection skipLog", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = {test: new TestRouteString() };

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect(oError.msg() ).toBe( "not skip error" );
			fnDone();
		} );

		setTimeout( () => {
			const oCustomError = new CustomError();
			oCustomError.message = 'skip error';
			oCustomError.bSkipLog = true;
			throw oCustomError;
		}, 1 );

		setTimeout( () => {
			const oSubCustomError = new CustomError();
			oSubCustomError.bSkipLog = true;
			const oCustomError = new CustomError();
			oCustomError.message = 'skip error';
			oCustomError.mOrigin = oSubCustomError;
			throw oCustomError;
		}, 2 );

		setTimeout( () => {
			const oCustomError = new CustomError();
			oCustomError.message = 'not skip error';
			oCustomError.bSkipLog = false;
			throw oCustomError;
		}, 3 );
	} );



	it( "mapStack lib error", async ( fnDone ) => {

		// ситуация, когда по какой то причине вместо подгрузки sourcemapped-stacktrace библиотеки
		// произошла ошибка
		oRootBox.box( 'log' ).oneLogger().pMapStack = () => {
			throw "error";
		};
		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteString() };

		fnSendSpy.and.callFake( () => {
			oRootBox.box( 'log' ).oneLogger().pMapStack = oDeps.log.pMapStack;
			fnDone();
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget"></div>`,
		);
	} );
} );
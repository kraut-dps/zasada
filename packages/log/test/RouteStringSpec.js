import oRoot from "./_support/bootstrap.js";
import { RouteString } from "../src/route/RouteString.js";
import { CustomError } from "../src/CustomError.js";
import {ErrorWidget} from "./_support/ErrorWidget.js";



let oHelper, oOriginConsole, fnSendSpy = jasmine.createSpy('spy');

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
		oRoot.core.init( ( oLinker ) => {
			// чтобы не заморачиваться на задержку обработки stackMap
			oRoot.log.oneLogger().pMapStack = null;

			oLinker.setWidgets( { ErrorWidget } );
			oHelper = oRoot.test.oneHelper();
			fnDone();
		} );
	} );

	afterAll( () => {
		window.console = oOriginConsole;
	} )

	beforeEach( () => {
		fnSendSpy.calls.reset();
		oRoot.log.reset();
	} );


	it( "simple", async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: TestRouteString };
		oRoot.log.init();

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error origin' );
			fnDone();
		} );

		throw new Error( 'error origin' );
	} );

	it( 'undefined widget', async ( fnDone ) => {
		oRoot.log.oRouteTypes = { test: RouteString };
		oRoot.log.init();

		window.console = { log: fnDone };
		await oHelper.addHtmlAll(
			`<div class="_ _UndefinedWidget"></div>`,
		);
	} );

	it( 'long outerHTML', async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: TestRouteString };
		oRoot.log.init();

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect(sMessage.indexOf('...') !== -1).toBe(true);
			oError.contextHtml( 101 );
			fnDone();
		} );

		const s100Len = "1".repeat(100);
		await oHelper.addHtmlAll(
			`<div class="_ _UndefinedWidget" data="${s100Len}"></div>`,
		);
	} );

	it( 'Error without name', async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: RouteString };
		oRoot.log.init();

		window.console = { log: ( sMessage ) => {
				expect(sMessage.indexOf('#') !== -1).toBe(false);
				fnDone();
			} };
		await oHelper.addHtmlAll(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_REL_FROM_BAD}"></div>`,
		);
	} );

	it( "onunhandledrejection skipLog", async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: TestRouteString };
		oRoot.log.init();

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
		oRoot.log.pMapStack = () => {
			throw "error";
		};
		oRoot.log.oRouteTypes = { test: TestRouteString };
		oRoot.log.init();

		fnSendSpy.and.callFake( () => {
			fnDone();
		} );

		await oHelper.addHtmlAll(
			`<div class="_ _ErrorWidget"></div>`,
		);
	} );
} );
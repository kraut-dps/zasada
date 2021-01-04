import oRoot, {Widget} from "./_support/bootstrap.js";
import { RouteConsole } from "../src/route/RouteConsole.js";
import { CustomError } from "../src/CustomError.js";
import {ErrorWidget} from "./_support/ErrorWidget.js";

let oHelper, oOriginConsole, fnSendSpy = jasmine.createSpy('spy');

/**
 * @implements ILogRoute
 */
class TestRouteConsole extends RouteConsole {
	_send( ...aArgs ) {
		fnSendSpy( ...aArgs );
	}
}

describe( "RouteConsole", () => {

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

	beforeEach( () => {
		fnSendSpy.calls.reset();
		oRoot.log.reset();
	} );

	afterEach( () => {
		window.console = oOriginConsole;
	} )

	/*it( 'no blockId and widget', async ( fnDone ) => {

		// null, но на самом деле из дефолтного конфига возьмет RouteConsole
		oRoot.log.oneLogger().oRoutes = null;

		window.console = { error: ( s1, oError ) => {
			if( oError.sHelp === 'not-found-blockid' ) {
				fnDone();
			}
		} };
		await oHelper.addHtmlAll(
			`<div class="_"></div>`,
		);

	} );*/

	it( 'undefined widget console', async ( fnDone ) => {
		oRoot.log.oRouteTypes = { test: RouteConsole };
		oRoot.log.init();

		window.console = { error: () => {
			window.console = oOriginConsole;
			fnDone();
		} };
		await oHelper.addHtmlAll(
			`<div class="_ _UndefinedWidget"></div>`,
		);
	} );

	it( 'throw string', async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: RouteConsole };
		oRoot.log.init();

		class ThrowWidget extends Widget {
			run() {
				throw "exception";
			}
		}
		oRoot.core.oneLinker().setWidgets( { ThrowWidget } );
		window.console = { error: () => {
			fnDone();
		} };
		await oHelper.addHtmlAll(
			`<div class="_ _ThrowWidget"></div>`,
		);
	} );

	it( "type compat", async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: TestRouteConsole };
		oRoot.log.init();

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error object' );
			fnDone();
		} );

		await oHelper.addHtmlAll(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_COMPAT}"></div>`,
		);
	} );

	it( "type pure error", async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: TestRouteConsole };
		oRoot.log.init();

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error custom origin' );
			fnDone();
		} );

		const oError = new CustomError();
		oError.message =  'error custom origin';
		throw oError;
	} );

	it( "type error", async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: TestRouteConsole };
		oRoot.log.init();

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error origin' );
			fnDone();
		} );

		await oHelper.addHtmlAll(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_ERROR}"></div>`,
		);
	} );

	it( "type string", async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: TestRouteConsole };
		oRoot.log.init();

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error string' );
			fnDone();
		} );

		await oHelper.addHtmlAll(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_STRING}"></div>`,
		);
	} );

	it( "type string fake", async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: TestRouteConsole };
		oRoot.log.init();

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error string' );
			fnDone();
		} );
		window.onerror( 'error string' );
	} );
} );
import oDeps from "./../_support/deps.js";
import {RootBox} from "di-box";
import {Widget} from "./../../src/index.js";
import { RouteConsole } from "./../../src/log/route/RouteConsole.js";

import { CustomError } from "./../../src/log/CustomError.js";
import {ErrorWidget} from "../_support/ErrorWidget.js";

let oRootBox, oHelper, oOriginConsole, fnSendSpy = jasmine.createSpy('spy');

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

	it( "type compat", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteConsole() };

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error object' );
			fnDone();
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_COMPAT}"></div>`,
		);
	} );

	it( "type pure error", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteConsole() };

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error custom origin' );
			fnDone();
		} );

		const oError = new CustomError();
		oError.message =  'error custom origin';
		throw oError;
	} );

	it( "type error", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteConsole() };

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error origin' );
			fnDone();
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_ERROR}"></div>`,
		);
	} );

	it( "type string", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteConsole() };

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error string' );
			fnDone();
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_STRING}"></div>`,
		);
	} );

	it( "type string fake", async ( fnDone ) => {

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRouteConsole() };

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			expect( oError.msg() ).toEqual( 'error string' );
			fnDone();
		} );
		window.onerror( 'error string' );
	} );
} );
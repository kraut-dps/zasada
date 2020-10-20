import oDeps from "./../_support/deps.js";
import {RootBox} from "di-box";
import { RouteString } from "./../../src/log/route/RouteString.js";
import { RouteConsole } from "./../../src/log/route/RouteConsole.js";
import {ErrorWidget} from "../_support/ErrorWidget.js";
import {LogBox} from "../../src/log/LogBox.js";

let oRootBox, oHelper, oDepsFix, oConsoleOrigin, fnSendSpy = jasmine.createSpy('spy');

/**
 * @implements ILogRoute
 */
class TestRoute extends RouteString {
	_send( ...aArgs) {
		fnSendSpy( ...aArgs );
	}
}

/**
 * внутри отправки ошибки куда то, ошибка ))
 */
class TestRouteWithError extends RouteString {
	_send( ...aArgs) {
		fnSendSpy( ...aArgs );
		throw new Error("error in error");
	}
}

describe( "base", () => {

	beforeAll( ( fnDone ) => {
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

	beforeEach( () => {
		fnSendSpy.calls.reset();
		oRootBox.box( 'log' ).oneLogger().oRoutes = null;
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

		oRootBox.box( 'log' ).oneLogger().oRoutes = { test: new TestRoute() };
		oRootBox.box( 'log' ).oneLogger().pMapStack = oRootBox.box( 'log' ).pMapStack;

		fnSendSpy.and.callFake( ( sMessage, oError ) => {
			if( oError.msg() === 'error origin' ) {
				fnDone();
			}
		} );

		await oHelper.addHtml(
			`<div class="_ _ErrorWidget"></div>`,
		);

	} );
} );

describe( "SubErrors", () => {

	beforeEach( () => {
		fnSendSpy.calls.reset();
		oConsoleOrigin = window.console;
		oDepsFix = {...{}, ...oDeps};
		oDepsFix.log.pMapStack = null;
		oDepsFix.log.oRouteTypes = {
			test: TestRouteWithError
		};
	} );

	afterEach( () => {
		window.console = oConsoleOrigin
	} )

	it( "error in onunhandledrejection", async ( fnDone ) => {

		console = {
			log: fnDone
		};

		oRootBox = new RootBox( oDepsFix );
		oRootBox.box( 'log' ).init();

		// просто вызовет console.log в errorInOnunhandledrejection
		new Promise( () => {
			throw oRootBox.box( 'log' ).newError( {} );
		} );
	} );

	it( "error in onunhandledrejection 2", async ( fnDone ) => {

		// подменим обработчик
		class LogBoxUpdated extends LogBox {
			errorInOnunhandledrejection( oError, oEvent ) {
				if( oEvent.reason.message.indexOf( 'error in onunhandledrejection 2' ) !== -1 ) {
					fnDone();
				}
			}
		}
		oDepsFix.log._Box = LogBoxUpdated;
		oRootBox = new RootBox( oDepsFix );
		oRootBox.box( 'log' ).init();

		new Promise( () => {
			throw new Error('error in onunhandledrejection 2');
		} );
	} );

	it( "error in onerror", async ( fnDone ) => {

		console = {
			log: fnDone
		};

		oRootBox = new RootBox( oDepsFix );
		oRootBox.box( 'log' ).init();

		setTimeout(
			() => {
				throw new Error();
			},
			0
		);
	} );

	 it( "error in onerror 2", ( fnDone ) => {

		// подменим обработчик
		class LogBoxUpdated extends LogBox {
			errorInOnerror( oError, message, sourceURL, line, column, oErrorOrigin ) {
				if( oErrorOrigin.message === 'error in onerror 2' ) {
					//expect( fnSendSpy.calls.count() ).toEqual( 1 );
					fnDone();
				}
			}
		}
		oDepsFix.log._Box = LogBoxUpdated;
		oRootBox = new RootBox( oDepsFix );
		oRootBox.box( 'log' ).init();

		 setTimeout(
			 () => {
				throw new Error( 'error in onerror 2' );
			 },
			 0
		);
	} );

	it( "bad window.Error", async ( fnDone ) => {

		const ErrorOrigin = window.Error;
		window.Error = () => {
			return {};
		};

		try{
			oRootBox = new RootBox( oDepsFix );
			throw oRootBox.box( 'log' ).newError( {} );
		} catch( e ) {
			expect( e.stackOrigin() ).toEqual( null );
			window.Error = ErrorOrigin;
			fnDone();
		}
	} );
} );
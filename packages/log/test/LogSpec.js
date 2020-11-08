import oRoot from "./_support/bootstrap.js";
import { RouteString } from "../src/route/RouteString.js";
import { RouteConsole } from "../src/route/RouteConsole.js";
import { ErrorWidget } from "./_support/ErrorWidget.js";

let oHelper, oRootFix, oConsoleOrigin, fnSendSpy = jasmine.createSpy('spy');

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


	it( "unset route by name", () => {

		oRoot.log.init();
		const oLogger = oRoot.log.oneLogger();

		// изначально был задан тип
		oLogger.oRouteTypes = { test: RouteConsole };
		// потом его сбросили
		oLogger.oRouteTypes = { test: false };
		// нужно чтобы по новой Logger собрал oRoutes
		oLogger.oRoutes = null;

		expect( oLogger._getRoutes() ).toEqual({  } );
	} );

	it( "MapStack", async ( fnDone ) => {

		oRoot.log.oRouteTypes = { test: TestRoute };
		oRoot.log.init();

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
		oRootFix = {...{}, ...oRoot};
		oRootFix.log.reset();
		oRootFix.log.pMapStack = null;
		oRootFix.log.oRouteTypes = {
			test: TestRouteWithError
		};
	} );

	afterEach( () => {
		window.console = oConsoleOrigin;
	} )

	it( "error in onunhandledrejection", async ( fnDone ) => {

		console = {
			log: fnDone
		};

		oRootFix.log.init();

		// просто вызовет console.log в errorInOnunhandledrejection
		new Promise( () => {
			throw oRootFix.log.newError( {} );
		} );
	} );

	it( "error in onunhandledrejection 2", async ( fnDone ) => {

		// подменим обработчик`
		class LoggerTest extends oRootFix.log.Logger {
			errorInOnunhandledrejection( oError, oEvent ) {
				if( oEvent.reason.message.indexOf( 'error in onunhandledrejection 2' ) !== -1 ) {
					fnDone();
				}
			}
		}
		oRootFix.log.reset();
		oRootFix.log.Logger = LoggerTest;
		oRootFix.log.init();

		new Promise( () => {
			throw new Error('error in onunhandledrejection 2');
		} );
	} );

	it( "error in onerror", async ( fnDone ) => {

		console = {
			log: fnDone
		};

		oRootFix.log.reset();
		oRootFix.log.init();

		setTimeout(
			() => {
				throw new Error();
			},
			0
		);
	} );

	 it( "error in onerror 2", ( fnDone ) => {

		// подменим обработчик
		class LoggerTest extends oRootFix.log.Logger {
			errorInOnerror( oError, message, sourceURL, line, column, oErrorOrigin ) {
				if( oErrorOrigin.message === 'error in onerror 2' ) {
					//expect( fnSendSpy.calls.count() ).toEqual( 1 );
					fnDone();
				}
			}
		}
		oRootFix.log.Logger = LoggerTest;
		oRootFix.log.reset();
		oRootFix.log.init();

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
			throw oRootFix.log.newError( {} );
		} catch( e ) {
			expect( e.stackOrigin() ).toEqual( null );
			window.Error = ErrorOrigin;
			fnDone();
		}
	} );
} );
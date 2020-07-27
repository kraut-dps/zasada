import {Widget} from '../../src/Widget.js';
import {TestMainBox} from "../_support/main/TestMainBox.js";
import { RouteString } from "../../src/log/route/RouteString.js";
import { RouteConsole } from "../../src/log/route/RouteConsole.js";

let oApp, fnSendSpy = jasmine.createSpy('spy');

class ErrorWidget extends Widget {

	static TYPE_ERROR = 1;
	static TYPE_COMPAT = 2;
	static TYPE_STRING = 3;

	iType = ErrorWidget.TYPE_ERROR;

	run() {

		this._attrProp( { 'type': 'i:iType' } );

		switch( this.iType ) {
			case ErrorWidget.TYPE_ERROR:
				throw new Error( 'error' );
			case ErrorWidget.TYPE_COMPAT:
				throw { message: 'error', sourceURL: 'sourceURL', line: 'line' };
			case ErrorWidget.TYPE_STRING:
				throw 'error';
		}
	}
}

/**
 * @implements ILogRoute
 */
class TestRouteString extends RouteString {
	_send( ...aArgs ) {
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

	beforeAll( ( hDone ) => {
		oApp = new TestMainBox();
		oApp.basePolyfills( () => {
			oApp.oneLogBox().oneLogger().fnAsyncOneMapStack = null;
			oApp.oneCoreBox().oneLinker().setWidgets( { ErrorWidget } );

			hDone();
		} );

	} );

	beforeEach( () => {
		fnSendSpy.calls.reset();
	} );


	it( "RouteString", async () => {

		oApp.oneLogBox().oneLogger().aRoutes = [ new TestRouteString() ];

		await oApp.addHtml(
			`<div class="_ _ErrorWidget"></div>`,
		);

		expect( fnSendSpy.calls.count() ).toEqual(1);
		expect( fnSendSpy.calls.mostRecent().args[0][ 'sError' ]).toEqual('error' );

	} );

	it( "RouteConsole", async () => {

		oApp.oneLogBox().oneLogger().aRoutes = [ new TestRouteConsole() ];

		await oApp.addHtml(
			`<div class="_ _ErrorWidget"></div>`,
		);

		expect( fnSendSpy.calls.count() ).toEqual(1);
		expect( fnSendSpy.calls.mostRecent().args[0][ 1 ]).toEqual('error' );

	} );

	it( "types", async () => {

		oApp.oneLogBox().oneLogger().aRoutes = [ new TestRouteConsole() ];


		await oApp.addHtml(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_COMPAT}"></div>`,
		);

		expect( fnSendSpy.calls.count() ).toEqual(1);
		expect( fnSendSpy.calls.mostRecent().args[0][ 1 ]).toEqual('error' );

		await oApp.addHtml(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_ERROR}"></div>`,
		);

		expect( fnSendSpy.calls.count() ).toEqual(2);
		expect( fnSendSpy.calls.mostRecent().args[0][ 1 ]).toEqual('error' );

		await oApp.addHtml(
			`<div class="_ _ErrorWidget" data-type="${ErrorWidget.TYPE_STRING}"></div>`,
		);

		expect( fnSendSpy.calls.count() ).toEqual(3);
		expect( fnSendSpy.calls.mostRecent().args[0][ 1 ]).toEqual('error' );

	} );

	it( "MapStack", async ( hDone ) => {

		oApp.oneLogBox().oneLogger().fnAsyncOneMapStack = oApp.oneLogBox().asyncOneMapStack;
		oApp.oneLogBox().oneLogger().aRoutes = [ new TestRouteString() ];

		await oApp.addHtml(
			`<div class="_ _ErrorWidget"></div>`,
		);

		fnSendSpy.and.callFake( ( oSend ) => {
			expect( oSend[ 'sError' ] ).toEqual('error' );
			hDone();
		} );
	} );
} );
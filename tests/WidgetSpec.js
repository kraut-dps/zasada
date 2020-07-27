import {Widget} from '../src/Widget.js';
import {TestMainBox} from "zasada/tests/_support/main/TestMainBox.js";

let oApp;

describe( "Widget", () => {

	beforeAll( ( fnDone ) => {
		oApp = new TestMainBox();
		oApp.basePolyfills( fnDone );
	} );

	afterAll( () => {
		oApp.destroy();
	} );

	it( ".link .unlink", async () => {
		let fnRunSpy = jasmine.createSpy('spy' );
		let fnDestructorSpy = jasmine.createSpy('spy' );

		class TestWidget extends Widget {
		}

		class TestSubWidget extends Widget {
			run() {
				fnRunSpy();
			}
			destructor() {
				fnDestructorSpy();
			}
		}

		oApp.oneCoreBox().oneLinker().setWidgets( { TestWidget, TestSubWidget } );
		await oApp.addHtml(
			'<div class="widget _ _TestWidget"></div>'
		);

		const oWidget = oApp.widget( '.widget', TestWidget );

		expect( fnRunSpy.calls.count() ).toEqual(0 );
		expect( fnDestructorSpy.calls.count() ).toEqual(0 );

		// создадим динамическое содержимое, привяжем
		oWidget.bl().innerHTML = '<div class="sub_widget _ _TestSubWidget"></div>';
		await oWidget._link( '' );

		expect( fnRunSpy.calls.count() ).toEqual(1 );
		expect( fnDestructorSpy.calls.count() ).toEqual(0 );

		// отвяжем
		oWidget._unlink( '' );

		expect( fnRunSpy.calls.count() ).toEqual(1 );
		expect( fnDestructorSpy.calls.count() ).toEqual(1 );
	} );

	it( "._el()", async () => {

		oApp.oneCoreBox().oneLinker().setWidgets( { Widget } );
		await oApp.addHtml(
			'<div class="widget _ _Widget">' +
				'<div class="_Widget-Item">1</div>' +
				'<div class="_Widget-Item">2</div>' +
			'</div>'
		);

		const oWidget = oApp.widget( '.widget', Widget );

		expect( oWidget._el( 'Item[]' ).length ).toEqual(2 );
		expect( oWidget._el( 'Item' ).textContent ).toEqual('1' );

		oWidget.bl().innerHTML = '<div class="_Widget-Item">3</div>';

		expect( oWidget._el( 'Item' ).textContent ).toEqual('1' );

		oWidget._elReset();

		expect( oWidget._el( 'Item' ).textContent ).toEqual('3' );
	} );

	it( ".rel()", async () => {

		class TestWidget extends Widget {

		}

		oApp.oneCoreBox().oneLinker().setWidgets( { TestWidget } );
		await oApp.addHtml(
			'<div class="widget1 _ _TestWidget"></div>' +
				'<div class="widget2 _ _TestWidget"></div>'
		);

		const oWidget1 = oApp.widget( '.widget1', TestWidget );
		const oWidget2 = oApp.widget( '.widget2', TestWidget );

		// тут только coverage rel false, остальное отдельно в RelQuery тестируется
		expect( oWidget1.rel( false ).onlyFirst().cssSel('.widget1').find() ).toEqual( oWidget1 );
		expect( oWidget1.rel( false ).onlyFirst().cssSel('.widget2').find() ).toEqual( oWidget2 );
	} );

	it( ".on() .off() .fire()", async () => {

		class TestWidget extends Widget {

		}

		oApp.oneCoreBox().oneLinker().setWidgets( { TestWidget } );
		await oApp.addHtml(
			'<div class="widget _ _TestWidget"></div>'
		);

		const oWidget = oApp.widget( '.widget1', TestWidget );
		let fnOnSpy = jasmine.createSpy('spy' );



		oWidget._on( '', 'event', fnOnSpy );

		expect( fnOnSpy.calls.count() ).toEqual(0 );

		oWidget._fire( '', 'event' );
		oWidget._fire( '', 'event' );

		expect( fnOnSpy.calls.count() ).toEqual(2 );

		oWidget._off( '', 'event', fnOnSpy );

		oWidget._fire( '', 'event' );

		expect( fnOnSpy.calls.count() ).toEqual(2 );

	} );
} );
import oDeps from "./_support/deps.js";
import {RootBox} from "di-box";
import {Widget} from "./../src/index.js";

let oHelper, oLinker;

describe( "Widget", () => {

	beforeAll( ( fnDone ) => {
		const oRootBox = new RootBox( oDeps );
		oRootBox.box( 'core' ).init( () => {
			oHelper = oRootBox.box( 'test' ).oneHelper();
			oLinker = oRootBox.box( 'core' ).oneLinker();
			fnDone();
		} );
	} );

	afterAll( () => {
		oHelper.destroy();
	} );

	it( "._link() ._unlink()", async () => {
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

		oLinker.setWidgets( { TestWidget, TestSubWidget } );
		await oHelper.addHtml(
			'<div class="widget _ _TestWidget"></div>'
		);

		const oWidget = oHelper.widget( '.widget', TestWidget );

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

		oLinker.setWidgets( { Widget } );
		await oHelper.addHtml(
			'<div class="widget _ _Widget">' +
				'<div class="_Widget-Item">1</div>' +
				'<div class="_Widget-Item">2</div>' +
			'</div>'
		);

		const oWidget = oHelper.widget( '.widget', Widget );

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

		oLinker.setWidgets( { TestWidget } );
		await oHelper.addHtml(
			`<div class="widget1 _ _TestWidget">
				<div class="widget2 _ _TestWidget"></div>
				<div class="widget3 _ _TestWidget _TestWidget-Element"></div>
			</div>`
		);

		const oWidget1 = oHelper.widget( '.widget1', TestWidget );
		const oWidget2 = oHelper.widget( '.widget2', TestWidget );
		const oWidget3 = oHelper.widget( '.widget3', TestWidget );

		// тут только coverage rel false, остальное отдельно в RelQuery тестируется
		expect( oWidget1.rel().cssSel('.widget1').find() ).toEqual( oWidget1 );
		expect( oWidget1.rel().cssSel('.widget2').find() ).toEqual( oWidget2 );
		expect( oWidget1.rel( 'Element' ).find() ).toEqual( oWidget3 );
	} );

	it( ".rel() prev next", async () => {

		class TestWidget extends Widget {
			_getIndex() {
				return this.bl().getAttribute( 'data-index' );
			}
		}

		class TestWidget2 extends Widget {
			_getIndex() {
				return this.bl().getAttribute( 'data-index' );
			}
		}

		oLinker.setWidgets( { TestWidget, TestWidget2 } );
		await oHelper.addHtml(
			`<div class="widget1 _ _TestWidget" data-index="widget1"></div>
				<div class="widget2 _ _TestWidget2" data-index="widget2"></div>
				<div class="widget3 _ _TestWidget" data-index="widget3"></div>
				<div class="widget4 _ _TestWidget2 _TestWidget" data-index="widget4"></div>
			`
		);

		const oWidget1 = oHelper.widget( '.widget1', TestWidget );
		const oWidget2 = oHelper.widget( '.widget2', TestWidget2 );
		const oWidget3 = oHelper.widget( '.widget3', TestWidget );
		const oWidget42 = oHelper.widget( '.widget4', TestWidget2 );
		const oWidget41 = oHelper.widget( '.widget4', TestWidget );

		expect( oWidget1.rel().next().typeOf( TestWidget2 ).find( true ) ).toEqual( [ oWidget2, oWidget42 ] );
		expect( oWidget2.rel().prev().typeOf( TestWidget ).find( true ) ).toEqual( [ oWidget1 ] );
		expect( oWidget1.rel().prev().withFrom( false ).typeOf( TestWidget ).canEmpty().find() ).toEqual( null );
		expect( oWidget42.rel().self().typeOf( TestWidget ).find() ).toEqual( oWidget41 );
		expect( oWidget1.rel().next().typeOf( TestWidget ).index( 'widget3' ).find() ).toEqual( oWidget3 );
		expect( oWidget3.rel().next().typeOf( TestWidget ).canEmpty().index( 'widget1' ).find() ).toEqual( null );
		expect( oWidget41.rel().prev().typeOf( TestWidget2 ).index( 'widget4' ).find() ).toEqual( oWidget42 );
		expect( oWidget41.rel().prev().typeOf( TestWidget ).index( 'widget1' ).find() ).toEqual( oWidget1 );
		expect( oWidget1.rel().prev().typeOf( TestWidget ).canEmpty().index( 'widget4' ).find() ).toEqual( null );
		expect( oWidget1.rel().self().canEmpty().index( 'widget4' ).find() ).toEqual( null );
	} );

	it( "._on() ._off() ._fire()", async () => {

		class TestWidget extends Widget {

		}

		oLinker.setWidgets( { TestWidget } );
		await oHelper.addHtml(
			'<div class="widget _ _TestWidget"></div>'
		);

		const oWidget = oHelper.widget( '.widget1', TestWidget );
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

	// it( "._fireNative()", async () => {
	//
	// 	class TestWidget extends Widget {
	//
	// 	}
	//
	// 	oLinker.setWidgets( { TestWidget } );
	// 	await oHelper.addHtml(
	// 		'<div class="widget _ _TestWidget">' +
	// 			'<div class="_TestWidget-El"></div>' +
	// 		'</div>'
	// 	);
	//
	// 	const oWidget = oHelper.widget( '.widget', TestWidget );
	// 	let fnOnSpy = jasmine.createSpy('spy' );
	//
	// 	oWidget._on( '', 'click', fnOnSpy );
	//
	// 	expect( fnOnSpy.calls.count() ).toEqual(0 );
	//
	// 	oWidget._fireNative( 'El', 'click' );
	// 	expect( fnOnSpy.calls.count() ).toEqual(0 );
	//
	// 	// хоть и кликаем по элементу, в самом блоке тоже отдается, потому что bubles = true
	// 	oWidget._fireNative( 'El', 'click', true );
	// 	oWidget._fireNative( 'El', 'click', true );
	//
	// 	expect( fnOnSpy.calls.count() ).toEqual(2 );
	//
	// } );

	it( ".attr() .attrs() .my()", async () => {

		class TestWidget extends Widget {
			iVar1 = null;
			sVar2 = null;
		}

		oLinker.setWidgets( { TestWidget } );
		await oHelper.addHtml(
			'<div class="widget _ _TestWidget" data-var1="7" data-var2="two" var3="3"></div>'
		);

		const oWidget = oHelper.widget( '.widget', TestWidget );
		expect( oWidget._attr( '', 'i:var1' )).toEqual( 7 );
		expect( oWidget._attr( oWidget.bl(), 'i:var1' )).toEqual( 7 );
		expect( oWidget._attr( [ oWidget.bl() ], 'i:var1' )).toEqual( 7 );
		expect( oWidget._attr( 'UndefinedElement?', 'i:var1' )).toEqual( null );
		expect( oWidget._attr( '', 'i:var3', '' )).toEqual( 3 );
		expect( oWidget._attrs( '', [ 'i:var1', 'var2' ] )).toEqual( { var1: 7, var2: "two" } );
		oWidget._my( { var1: 'i:iVar1', var2: 'sVar2' } );
		expect( oWidget.iVar1 ).toEqual( 7 );
		expect( oWidget.sVar2 ).toEqual( 'two' );
	} );

	it( ".mod()", async () => {

		class TestWidget extends Widget {
		}

		oLinker.setWidgets( { TestWidget } );
		await oHelper.addHtml(
			'<div class="widget _ _TestWidget"></div>'
		);

		const oWidget = oHelper.widget( '.widget', TestWidget );

		oWidget._mod( '', 'widget_mod', true );
		expect( oWidget.bl().classList.contains( 'widget_mod' ) ).toEqual( true );

		oWidget._mod( '', 'widget_mod', false );
		expect( oWidget.bl().classList.contains( 'widget_mod' ) ).toEqual( false );

		oWidget._mod( '', [ 'widget_mod1', 'widget_mod2' ], 'widget_mod1' );
		expect( oWidget.bl().classList.contains( 'widget_mod1' ) ).toEqual( true );
		expect( oWidget.bl().classList.contains( 'widget_mod2' ) ).toEqual( false );

		oWidget._mod( '', [ 'widget_mod1', 'widget_mod2' ], 'widget_mod2' );
		expect( oWidget.bl().classList.contains( 'widget_mod1' ) ).toEqual( false );
		expect( oWidget.bl().classList.contains( 'widget_mod2' ) ).toEqual( true );

		oWidget._mod( '', { mod1: 'widget_mod1', mod2: 'widget_mod2' }, 'mod1' );
		expect( oWidget.bl().classList.contains( 'widget_mod1' ) ).toEqual( true );
		expect( oWidget.bl().classList.contains( 'widget_mod2' ) ).toEqual( false );
	} );

	it( ".import()", async () => {

		class TestWidget extends Widget {
		}

		oLinker.setWidgets( { TestWidget } );

		let fnImport1 = jasmine.createSpy('spy' );
		let fnImport2 = jasmine.createSpy('spy' );

		oLinker.setImports( {
			fnImport1,
			fnImport2,
		} );

		await oHelper.addHtml(
			'<div class="widget _ _TestWidget"></div>'
		);

		const oWidget = oHelper.widget( '.widget', TestWidget );

		expect( fnImport1.calls.count() ).toEqual(0 );
		oWidget._import( 'fnImport1' );
		expect( fnImport1.calls.count() ).toEqual(1 );

		// создадим одтельное правило, что fnCustomImport = fnImport2 для нашего виджета
		oLinker.setOpts( {
			TestWidget: {
				oImports: {
					fnCustomImport: 'fnImport2'
				}
			}
		} );

		expect( fnImport2.calls.count() ).toEqual(0 );
		oWidget._import( 'fnCustomImport' );
		expect( fnImport2.calls.count() ).toEqual(1 );

		try{
			oWidget._import( 'fnUndefined' );
			fail();
		} catch( e ) {}
	} );

	it( "._html()", async ( fnDone ) => {

		class TestWidget extends Widget {}

		oLinker.setWidgets( { TestWidget } );
		await oHelper.addHtml( `<div class="widget1 _ _TestWidget"></div>
			<div class="widget2 _ _TestWidget">
				<div class="widget4 _ _TestWidget"></div>
			</div>
			<div class="widget3 _ _TestWidget"></div>` );

		const oWidget1 = oHelper.widget( '.widget1', TestWidget );
		const oWidget2 = oHelper.widget( '.widget2', TestWidget );
		const oWidget3 = oHelper.widget( '.widget3', TestWidget );

		// widget4 exists
		expect( oWidget2.rel().typeOf( TestWidget ).cssSel( '.widget4' ).canEmpty().find() !== null ).toEqual( true );

		// widget4 replace widget5
		await oWidget2._html( '', '<div class="widget5 _ _TestWidget"></div>' );

		// widget6 beforebegin
		await oWidget2._html( '', '<div class="widget6 _ _TestWidget"></div>', 'beforebegin' );

		// widget7 afterbegin
		await oWidget2._html( '', '<div class="widget7 _ _TestWidget"></div>', 'afterbegin' );

		// widget8 beforeend
		await oWidget2._html( '', '<div class="widget8 _ _TestWidget"></div>', 'beforeend' );

		// widget9 afterend
		await oWidget2._html( '', '<div class="widget9 _ _TestWidget"></div>', 'afterend' );

		const oWidget5 = oHelper.widget( '.widget5', TestWidget );
		const oWidget6 = oHelper.widget( '.widget6', TestWidget );
		const oWidget7 = oHelper.widget( '.widget7', TestWidget );
		const oWidget8 = oHelper.widget( '.widget8', TestWidget );
		const oWidget9 = oHelper.widget( '.widget9', TestWidget );

		// widget4 not exists
		expect( oWidget2.rel().typeOf( TestWidget ).cssSel( '.widget4' ).canEmpty().find() !== null ).toEqual( false );

		// widget1 next widget6
		expect( oWidget1.bl().nextElementSibling === oWidget6.bl() ).toEqual( true );

		// widget6 next widget2
		expect( oWidget6.bl().nextElementSibling === oWidget2.bl() ).toEqual( true );

		// widget7 firstChild of widget2
		expect( oWidget2.bl().firstElementChild === oWidget7.bl() ).toEqual( true );

		// widget7 next widget5
		expect( oWidget7.bl().nextElementSibling === oWidget5.bl() ).toEqual( true );

		// widget7 next widget5
		expect( oWidget5.bl().nextElementSibling === oWidget8.bl() ).toEqual( true );

		// widget8 lastChild of widget2
		expect( oWidget2.bl().lastElementChild === oWidget8.bl() ).toEqual( true );

		// widget2 next widget9
		expect( oWidget2.bl().nextElementSibling === oWidget9.bl() ).toEqual( true );

		// widget9 next widget3
		expect( oWidget9.bl().nextElementSibling === oWidget3.bl() ).toEqual( true );

		// widget10 and widget11 afterend
		await oWidget2._html( '', '<div class="widget10 _ _TestWidget"></div>text<div class="widget11 _ _TestWidget"></div>', 'afterend' );

		const oWidget10 = oHelper.widget( '.widget10', TestWidget );
		const oWidget11 = oHelper.widget( '.widget11', TestWidget );

		// widget2 next widget10
		expect( oWidget2.bl().nextElementSibling === oWidget10.bl() ).toEqual( true );

		// widget10 next widget11
		expect( oWidget10.bl().nextElementSibling === oWidget11.bl() ).toEqual( true );

		// text afterend
		await oWidget2._html( '', 'text', 'afterend' );

		fnDone();
	} );

	it( "._wrapError()", async () => {
		class TestWidget extends Widget {}

		oLinker.setWidgets( { TestWidget } );
		await oHelper.addHtml( `<div class="widget _ _TestWidget"></div>` );

		const oWidget = oHelper.widget( '.widget', TestWidget );

		let fn = () => {
			throw new Error( 12 );
		};

		fn = oWidget._wrapError( fn );

		try {
			fn();
			fail();
		} catch( e ) {
			expect( e.oWidget ).toEqual( oWidget );
		}
	} );
} );
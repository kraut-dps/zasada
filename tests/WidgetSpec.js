import oDeps from "./_support/deps.js";
import {RootBox} from "di-box";
import {Widget} from "./../src/index.js";

let oHelper, oLinker;

describe( "Widget", () => {

	beforeAll( ( fnDone ) => {
		const oRootBox = new RootBox( oDeps );
		oRootBox.box( 'core' ).init( ( oLinkerReal ) => {
			oHelper = oRootBox.box( 'test' ).oneHelper();
			oLinker = oLinkerReal;
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

	it( "._widget()", async () => {
		let fnRunTestSubWidget1Spy = jasmine.createSpy('spy' );
		let fnRunTestSubWidget2Spy = jasmine.createSpy('spy' );

		class TestWidget extends Widget {
			async run() {
				await this._widget( this.bl(), 'TestSubWidget1' );
				return await this._widget( this.bl(), 'TestSubWidget2', { oProps: { iVar: 10 } } );
			}
		}

		class TestSubWidget1 extends Widget {
			run() {
				fnRunTestSubWidget1Spy();
			}
		}

		class TestSubWidget2 extends Widget {
			iVar = 3;
			run() {
				if( this.iVar === 10 ) {
					fnRunTestSubWidget2Spy();
				}
			}
		}

		oLinker.setWidgets( { TestWidget, TestSubWidget1, TestSubWidget2 } );

		expect( fnRunTestSubWidget1Spy.calls.count() ).toEqual( 0 );
		expect( fnRunTestSubWidget2Spy.calls.count() ).toEqual( 0 );

		await oHelper.addHtml(
			'<div class="widget _ _TestWidget"></div>'
		);

		expect( fnRunTestSubWidget1Spy.calls.count() ).toEqual( 1 );
		expect( fnRunTestSubWidget2Spy.calls.count() ).toEqual( 1 );
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

	it( "._el() 2", async () => {

		class Widget1 extends Widget {}
		class Widget2 extends Widget{}
		oLinker.setWidgets( { Widget1, Widget2 } );
		await oHelper.addHtml(
			'<div class="widget _ _Widget1 _Widget2">' +
			'<div class="_Widget1-El">1</div>' +
			'<div class="_Widget2-El">2</div>' +
			'</div>'
		);

		const oWidget1 = oHelper.widget( '.widget', Widget1 );
		const oWidget2 = oHelper.widget( '.widget', Widget2 );
		expect( oWidget2._el( 'El' ).textContent ).toEqual("2" );
		expect( oWidget1._el( 'El' ).textContent ).toEqual("1" );
		expect( oWidget2._el( 'El' ).textContent ).toEqual("2" );
	} );

	it( "._rel()", async () => {

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
		expect( oWidget1._rel().cssSel('.widget1').find() ).toEqual( oWidget1 );
		expect( oWidget1._rel().cssSel('.widget2').find() ).toEqual( oWidget2 );
		expect( oWidget1._rel( 'Element' ).find() ).toEqual( oWidget3 );
	} );

	it( "._rel() prev next", async () => {

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

		expect( oWidget1._rel().next().typeOf( TestWidget2 ).find( true ) ).toEqual( [ oWidget2, oWidget42 ] );
		expect( oWidget2._rel().prev().typeOf( TestWidget ).find( true ) ).toEqual( [ oWidget1 ] );
		expect( oWidget1._rel().prev().withFrom( false ).typeOf( TestWidget ).canEmpty().find() ).toEqual( null );
		expect( oWidget42._rel().self().typeOf( TestWidget ).find() ).toEqual( oWidget41 );
		expect( oWidget1._rel().next().typeOf( TestWidget ).index( 'widget3' ).find() ).toEqual( oWidget3 );
		expect( oWidget3._rel().next().typeOf( TestWidget ).canEmpty().index( 'widget1' ).find() ).toEqual( null );
		expect( oWidget41._rel().prev().typeOf( TestWidget2 ).index( 'widget4' ).find() ).toEqual( oWidget42 );
		expect( oWidget41._rel().prev().typeOf( TestWidget ).index( 'widget1' ).find() ).toEqual( oWidget1 );
		expect( oWidget1._rel().prev().typeOf( TestWidget ).canEmpty().index( 'widget4' ).find() ).toEqual( null );
		expect( oWidget1._rel().self().canEmpty().index( 'widget4' ).find() ).toEqual( null );
	} );

	it( "._rel().onAdd()", async ( fnDone ) => {

		let fnAddGlobalSpy = jasmine.createSpy('spy' );
		let fnAddSpy = jasmine.createSpy('spy' );
		let fnDropSpy = jasmine.createSpy('spy' );

		class TestWidget extends Widget {
			dropAll() {
				this._unlink( '' );
				this.bl().innerHTML = '';
			}
			addItem() {
				return this._html( '', '<div class="_ _TestItem"></div>' );
			}
		}

		class TestArray extends Widget {
			run() {
				this._rel().child().typeOf( TestItem )
					.onAdd( () => {
						fnAddSpy();
					} )
					.onDrop( () => {
						fnDropSpy();
					} )
			}

			addItem() {
				return this._html( '', '<div class="_ _TestItem"></div>' );
			}

			dropItem() {
				this._unlink( '' );
				return this.bl().innerHTML = '';
			}
		}

		class TestItem extends Widget {
		}

		oLinker.setWidgets( { TestWidget, TestArray, TestItem } );
		await oHelper.addHtml(
			`<div class="main _ _TestWidget"><div class="array _ _TestArray"></div></div>`
		);

		oLinker.newRelQuery().typeOf( TestItem ).onAdd( () => {
			fnAddGlobalSpy();
		} )

		const oMain = oHelper.widget( '.main', TestWidget );
		const oTestArray = oHelper.widget( '.array', TestArray );

		// отметим, что до добавления ничего не вызвалось
		// и добавим новый элемнет
		expect( fnAddGlobalSpy.calls.count() ).toEqual( 0 );
		expect( fnAddSpy.calls.count() ).toEqual( 0 );
		expect( fnDropSpy.calls.count() ).toEqual( 0 );
		await oTestArray.addItem();

		expect( fnAddGlobalSpy.calls.count() ).toEqual( 1 );
		expect( fnAddSpy.calls.count() ).toEqual( 1 );
		expect( fnDropSpy.calls.count() ).toEqual( 0 );
		oTestArray.dropItem();

		expect( fnAddGlobalSpy.calls.count() ).toEqual( 1 );
		expect( fnAddSpy.calls.count() ).toEqual( 1 );
		expect( fnDropSpy.calls.count() ).toEqual( 1 );
		oMain.dropAll();

		expect( fnAddGlobalSpy.calls.count() ).toEqual( 1 );
		expect( fnAddSpy.calls.count() ).toEqual( 1 );
		expect( fnDropSpy.calls.count() ).toEqual( 1 );

		// тут виджет с событием удаляется, поэтому вызовов fnAddSpy и fnDropSpy быть не должно
		await oMain.addItem();
		expect( fnAddGlobalSpy.calls.count() ).toEqual( 2 );
		expect( fnAddSpy.calls.count() ).toEqual( 1 );
		expect( fnDropSpy.calls.count() ).toEqual( 1 );

		fnDone();
	} );

	it( "._rel().onAdd() 2", async ( fnDone ) => {

		let fnAddByTypeBadSpy = jasmine.createSpy('spy' );
		let fnAddByTypeOkSpy = jasmine.createSpy('spy' );
		let fnAddByIndexBadSpy = jasmine.createSpy('spy' );
		let fnAddByIndexOkSpy = jasmine.createSpy('spy' );
		let fnAddByWayBadSpy = jasmine.createSpy('spy' );
		let fnAddByWayOkSpy = jasmine.createSpy('spy' );

		class TestWidget extends Widget {
			run() {
				this._rel().typeOf( TestWidget ).onAdd( () => {
					fnAddByTypeBadSpy();
				} );
				this._rel().typeOf( AddWidget ).onAdd( () => {
					fnAddByTypeOkSpy();
				} );
				this._rel().index( 11 ).onAdd( () => {
					fnAddByIndexBadSpy();
				} );
				this._rel().index(12).onAdd( () => {
					fnAddByIndexOkSpy();
				} );
				this._rel().parent().typeOf( AddWidget ).onAdd( () => {
					fnAddByWayBadSpy();
				} );
				this._rel().child().typeOf( AddWidget ).onAdd( () => {
					fnAddByWayOkSpy();
				} );
			}
			addItem() {
				return this._html( '', '<div class="_ _AddWidget"></div>' );
			}
		}

		class AddWidget extends Widget {
			_getIndex() {
				return 12;
			}
		}

		oLinker.setWidgets( { TestWidget, AddWidget } );
		await oHelper.addHtml(
			`<div class="main _ _TestWidget"></div>`
		);

		const oMain = oHelper.widget( '.main', TestWidget );
		await oMain.addItem();

		expect( fnAddByTypeBadSpy.calls.count() ).toEqual( 0 );
		expect( fnAddByTypeOkSpy.calls.count() ).toEqual( 1 );
		expect( fnAddByIndexBadSpy.calls.count() ).toEqual( 0 );
		expect( fnAddByIndexOkSpy.calls.count() ).toEqual( 1 );
		expect( fnAddByWayBadSpy.calls.count() ).toEqual( 0 );
		expect( fnAddByWayOkSpy.calls.count() ).toEqual( 1 );

		fnDone();
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
		oWidget._fire( '', 'event', {} );

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
		oWidget._my( { var3: 'i:iVar1' }, '' );
		expect( oWidget.iVar1 ).toEqual( 3 );
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
		expect( oWidget2._rel().typeOf( TestWidget ).cssSel( '.widget4' ).canEmpty().find() !== null ).toEqual( true );

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
		expect( oWidget2._rel().typeOf( TestWidget ).cssSel( '.widget4' ).canEmpty().find() !== null ).toEqual( false );

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
import oRoot, {Widget} from "./_support/bootstrap.js";

let oHelper, oLinker;

describe( "Linker", () => {

	beforeAll( ( fnDone ) => {

		oRoot.core.init( ( oLinkerReal ) => {
			oLinker = oLinkerReal;
			oHelper = oRoot.test.oneHelper();
			fnDone();
		} );

	} );

	describe( 'props', () => {

		// просто проверка что установятся свойства у виджета из настройки
		it( "simple", async () => {

			let fnDestructorSpy = jasmine.createSpy('spy' );

			class TestWidget extends Widget {
				sProp1;
				sProp2;
				sProp3;

				index() {
					return 'index';
				}

				destructor() {
					fnDestructorSpy();
				}
			}

			oLinker
				.setOpts( {
					TestWidget: {
						cWidget: TestWidget,
						oProps: {
							sProp1: 1,
							sProp2: 2,
						},
						fnAfterNew: ( oWidget ) => {
							oWidget.sProp3 = 3;
							// пока еще нет в хранилище
							expect( oWidget._rel().index( 'index' ).onlyFirst().canEmpty().find() ).toEqual( null );
							return oWidget;
						},
						fnBeforeRun: ( oWidget ) => {
							// проверяем что виджет уже внутри storage
							expect( oWidget._rel().index( 'index' ).onlyFirst().find() ).isPrototypeOf( TestWidget );
						}
					}
				} );
			await oHelper.addHtml(
				'<div class="widget _ _TestWidget"></div>'
			);

			const oWidget = oHelper.widget( '.widget', TestWidget );
			expect( oWidget.sProp1 ).toBe( 1 );
			expect( oWidget.sProp2 ).toBe( 2 );
			expect( oWidget.sProp3 ).toBe( 3 );

			expect( fnDestructorSpy.calls.count() ).toEqual(0 );

			oHelper.destroy();

			expect( fnDestructorSpy.calls.count() ).toEqual(1 );
		} );


		// проверка что установится сложная структура, произойдет deepMerge
		it( "struct", async () => {

			class TestWidget2 extends Widget {
				oStruct = null;
			}

			oLinker.setOpts( {
				TestWidget2: {
					cWidget: TestWidget2,
					oProps: {
						oStruct: {
							sKey1: 1
						},
					}
				}
			} );
			oLinker.setOpts( {
				TestWidget2: {
					cWidget: TestWidget2,
					oProps: {
						oStruct: {
							sKey2: 2
						},
					}
				}
			} );
			await oHelper.addHtml(
				'<div class="widget _ _TestWidget2"></div>'
			);

			const oWidget = oHelper.widget( '.widget', TestWidget2 );
			expect( oWidget.oStruct ).toEqual( {sKey1: 1, sKey2: 2} );
		} );
	} );

	it( 'setBeforeNew', async ( fnDone ) => {

		class BaseWidget extends Widget {
		}

		class LazyWidget extends Widget {
		}

		oLinker.setWidgets( {BaseWidget} );

		oLinker.setBeforeNew(
			['LazyWidget'],
			() => {
				oLinker.setWidgets( {LazyWidget} )
			}
		);

		await oHelper.addHtml(
			'<div class="base _ _BaseWidget"></div>' +
			'<div class="lazy _ _LazyWidget"></div>'
		);

		const oBaseWidget = oHelper.widget( '.base', BaseWidget );
		const oLazyWidget = oHelper.widget( '.lazy', LazyWidget );
		expect( oBaseWidget instanceof BaseWidget ).toBe( true );
		expect( oLazyWidget instanceof LazyWidget ).toBe( true );

		fnDone();
	} );

	describe( 'link', () => {

		it( 'not-found-blockid', async ( fnDone ) => {
			await oHelper.addHtml(
				`<div class="_"></div>`
			).catch( ( oError ) => {
				if( oError && oError.sHelp === 'not-found-blockid' ) {
					fnDone();
					return true;
				}
			} )
		} );

		it( 'no-widget-opts', async ( fnDone ) => {
			await oHelper.addHtml(
				`<div class="_ _UnknownWidget"></div>`
			).catch( ( oError ) => {
				if( oError && oError.sHelp === 'no-widget-opts' ) {
					fnDone();
				}
			} )
		} );

		it( 'no-widget-class', async ( fnDone ) => {

			oLinker.setOpts( {
				BadWidget: {}
			} );

			await oHelper.addHtml(
				`<div class="_ _BadWidget"></div>`
			).catch( ( oError ) => {
				if( oError && oError.mOrigin.sHelp === 'no-widget-class' ) {
					fnDone();
				}
			} )
		} );

		it( "no-widget-prop", async ( fnDone ) => {

			class TestWidget extends Widget {
				sProp1;
			}

			oLinker.setOpts( {
				TestWidget: {
					cWidget: TestWidget,
					oProps: {
						sProp3: 3,
					}
				}
			} );
			await oHelper.addHtml(
				'<div class="widget _ _TestWidget"></div>'
			).catch( ( oError ) => {
				if( oError && oError.mOrigin.sHelp === 'no-widget-prop' ) {
					fnDone();
				}
			} )
		} );

		it( 'link with self', async ( fnDone ) => {

			class SelfWidget extends Widget {
				run() {
					fnDone();
				}
			}

			oLinker.setWidgets( { SelfWidget } );
			const eDiv = document.createElement( 'div' );
			eDiv.className = '_ _SelfWidget'
			document.body.appendChild( eDiv );
			oLinker.link( eDiv, true );
		} );

	} );

	it( 'skipRun', async ( fnDone ) => {

		let bCheck;

		class SkipRunWidget extends Widget {
			run() {
				bCheck = true;
			}
		}

		// сначала стандартный запуск с run
		bCheck = false;
		oLinker.setOpts( {
			Widget: {
				cWidget: SkipRunWidget,
				bSkipRun: false
			}
		} );

		await oHelper.addHtml( '<div class="_ _Widget"></div>' );
		expect( bCheck ).toBe( true );

		// потом запуск с пропуском run
		bCheck = false;
		oLinker.setOpts( {
			Widget: {
				cWidget: SkipRunWidget,
				bSkipRun: true
			}
		} );

		await oHelper.addHtml( '<div class="_ _Widget"></div>' );
		expect( bCheck ).toBe( false );
		fnDone();
	} );
} );
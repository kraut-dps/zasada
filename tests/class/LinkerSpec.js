import {TestMainBox} from "../_support/main/TestMainBox.js";
import {Widget} from "../../src/Widget.js";
import {Linker} from "../../src/core/class/Linker.js";
import {CoreBox} from "../../src/core/CoreBox.js";

class LinkerWithError extends Linker {
	_error( mError, eContext, sBlockId, oWidget ) {
		throw mError;
	}
}


describe( "Linker", () => {

	beforeAll( ( hDone ) => {
		const oApp = new TestMainBox();
		oApp.basePolyfills( hDone );
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

			const oApp = new TestMainBox();
			oApp.oneCoreBox().oneLinker()
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
							expect( oWidget.rel().index( 'index' ).onlyFirst().canEmpty().find() ).toEqual( null );
							return oWidget;
						},
						fnBeforeRun: ( oWidget ) => {
							// проверяем что виджет уже внутри storage
							expect( oWidget.rel().index( 'index' ).onlyFirst().find() ).isPrototypeOf( TestWidget );
						}
					}
				} );
			await oApp.addHtml(
				'<div class="widget _ _TestWidget"></div>'
			);

			const oWidget = oApp.widget( '.widget', TestWidget );
			expect( oWidget.sProp1 ).toBe( 1 );
			expect( oWidget.sProp2 ).toBe( 2 );
			expect( oWidget.sProp3 ).toBe( 3 );

			expect( fnDestructorSpy.calls.count() ).toEqual(0 );

			oApp.destroy();

			expect( fnDestructorSpy.calls.count() ).toEqual(1 );
		} );


		// проверка что установится сложная структура, произойдет deepMerge
		it( "struct", async () => {

			class TestWidget extends Widget {
				oStruct = null;
			}

			const oApp = new TestMainBox();
			oApp.oneCoreBox().oneLinker()
				.setOpts( {
					TestWidget: {
						cWidget: TestWidget,
						oProps: {
							oStruct: {
								sKey1: 1
							},
						}
					}
				} );
			oApp.oneCoreBox().oneLinker()
				.setOpts( {
					TestWidget: {
						cWidget: TestWidget,
						oProps: {
							oStruct: {
								sKey2: 2
							},
						}
					}
				} );
			await oApp.addHtml(
				'<div class="widget _ _TestWidget"></div>'
			);

			const oWidget = oApp.widget( '.widget', TestWidget );
			expect( oWidget.oStruct ).toEqual( {sKey1: 1, sKey2: 2} );
		} );

		it( "undefined", async ( fnDone ) => {

			class TestCoreBox extends CoreBox {
				cLinker = LinkerWithError;
			}

			class TestApp extends TestMainBox {
				newCoreBox() {
					return new TestCoreBox( this );
				}
			}

			const oApp = new TestApp();


			class TestWidget extends Widget {
				sProp1;
			}

			oApp.oneCoreBox().oneLinker()
				.setOpts( {
					TestWidget: {
						cWidget: TestWidget,
						oProps: {
							sProp3: 3,
						}
					}
				} );
			await oApp.addHtml(
				'<div class="widget _ _TestWidget"></div>'
			).then( () => {
				fail();
			} )
				.catch( fnDone );

		} );
	} );

	it( 'setBeforeNew', async ( fnDone ) => {

		class BaseWidget extends Widget {
		}

		class LazyWidget extends Widget {
		}

		const oApp = new TestMainBox();
		oApp.oneCoreBox().oneLinker()
			.setWidgets( {BaseWidget} );

		oApp.oneCoreBox().oneLinker()
			.setBeforeNew(
				['LazyWidget'],
				() => {
					oApp.oneCoreBox().oneLinker()
						.setWidgets( {LazyWidget} )
				}
			);

		await oApp.addHtml(
			'<div class="base _ _BaseWidget"></div>' +
			'<div class="lazy _ _LazyWidget"></div>'
		);

		const oBaseWidget = oApp.widget( '.base', BaseWidget );
		const oLazyWidget = oApp.widget( '.lazy', LazyWidget );
		expect( oBaseWidget instanceof BaseWidget ).toBe( true );
		expect( oLazyWidget instanceof LazyWidget ).toBe( true );

		fnDone();
	} );

	describe( 'link', () => {
		it( 'not found tag class', async ( fnDone ) => {

			class TestCoreBox extends CoreBox {
				cLinker = LinkerWithError;
			}

			class TestApp extends TestMainBox {
				newCoreBox() {
					return new TestCoreBox( this );
				}
			}

			const oApp = new TestApp();

			try {
				await oApp.addHtml(
					`<div class="_"></div>`
				);
				fail();
			} catch ( e ) {
			}

			try {
				await oApp.addHtml(
					`<div class="_ _UnknownWidget"></div>`
				);
				fail();
			} catch ( e ) {
			}


			oApp.oneCoreBox().oneLinker().setOpts( {
				TestWidget: {}
			} );

			try {
				await oApp.addHtml(
					`<div class="_ _TestWidget"></div>`
				);
				fail();
			} catch ( e ) {
			}

			fnDone();
		} );
	} );

	it( 'skipRun', async ( fnDone ) => {

		let bCheck;

		class TestWidget extends Widget {
			run() {
				bCheck = true;
			}
		}

		const oApp = new TestMainBox();

		// сначала стандартный запуск с run
		bCheck = false;
		oApp.oneCoreBox().oneLinker()
			.setOpts( {
				Widget: {
					cWidget: TestWidget,
					bSkipRun: false
				}
			} );

		await oApp.addHtml( '<div class="_ _Widget"></div>' );
		expect( bCheck ).toBe( true );

		// потом запуск с пропуском run
		bCheck = false;
		oApp.oneCoreBox().oneLinker()
			.setOpts( {
				Widget: {
					cWidget: TestWidget,
					bSkipRun: true
				}
			} );

		await oApp.addHtml( '<div class="_ _Widget"></div>' );
		expect( bCheck ).toBe( false );


		fnDone();
	} );
} );
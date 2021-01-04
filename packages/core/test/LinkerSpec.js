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
			await oHelper.addHtmlAll(
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
			await oHelper.addHtmlAll(
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

		await oHelper.addHtmlAll(
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
			oHelper.addHtmlAll( `<div class="_"></div>` ).catch( ( oError ) => {
				expect( oError.sHelp ).toBe( 'not-found-blockid' );
				fnDone();
			} );
		} );

		it( 'no-widget-opts', async ( fnDone ) => {
			oHelper.addHtmlAll( `<div class="_ _UnknownWidget"></div>` ).catch( ( oError ) => {
				expect(oError.sHelp).toBe('no-widget-opts');
				fnDone();
			} );
		} );

		it( 'no-widget-class', async ( fnDone ) => {

			oLinker.setOpts( {
				BadWidget: {}
			} );

			oHelper.addHtmlAll( `<div class="_ _BadWidget"></div>` ).catch( ( oError ) => {
				expect(oError.mOrigin.sHelp).toBe('no-widget-class');
				fnDone();
			} );
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

			oHelper.addHtmlAll( `<div class="widget _ _TestWidget"></div>` ).catch( ( oError ) => {
				expect(oError.mOrigin.sHelp).toBe('no-widget-prop');
				fnDone();
			} )
		} );

		it( 'link with self', async ( fnDone ) => {

			const fnSelfWidgetRunSpy = jasmine.createSpy('spy' );

			class SelfWidget extends Widget {
				run() {
					fnSelfWidgetRunSpy();
				}
			}

			oLinker.setWidgets( { SelfWidget } );
			const eDiv = document.createElement( 'div' );
			eDiv.className = '_ _SelfWidget'
			document.body.appendChild( eDiv );

			await oLinker.link( eDiv, false );
			expect( fnSelfWidgetRunSpy.calls.count() ).toEqual(0 );

			await oLinker.link( eDiv );
			expect( fnSelfWidgetRunSpy.calls.count() ).toEqual(0 );

			await oLinker.link( eDiv, true );
			expect( fnSelfWidgetRunSpy.calls.count() ).toEqual(1 );

			fnDone();
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

		await oHelper.addHtmlAll( '<div class="_ _Widget"></div>' );
		expect( bCheck ).toBe( true );

		// потом запуск с пропуском run
		bCheck = false;
		oLinker.setOpts( {
			Widget: {
				cWidget: SkipRunWidget,
				bSkipRun: true
			}
		} );

		await oHelper.addHtmlAll( '<div class="_ _Widget"></div>' );
		expect( bCheck ).toBe( false );
		fnDone();
	} );

	it( 'parent-child', async ( fnDone ) => {

		class ParentWidget extends Widget {
			_iChildren;
			run() {
				this._iChildren = this._rel().child().typeOf( ChildWidget ).canEmpty().find( true ).length;
			}
			getChildren() {
				return this._iChildren;
			}
		}

		class ChildWidget extends Widget {
		}

		oLinker.setWidgets( {ParentWidget, ChildWidget} );

		await oHelper.addHtmlAll(
			'<div class="parent _ _ParentWidget">' +
				'<div class="child1 _ _ChildWidget"></div>' +
				'<div class="child2 _ _ChildWidget"></div>' +
			'</div>'
		);

		const oParent = oHelper.widget( '.parent', ParentWidget );
		expect( oParent.getChildren() ).toBe( 2 );

		fnDone();
	} );

	it( 'one two three', async ( fnDone ) => {

		class OneWidget extends Widget {
			run() {
				return new Promise( ( fnResolve ) => {
					setTimeout( () => {
						fnResolve();
					}, 1 );
				} );
			}
		}

		class TwoWidget extends Widget {
			run() {
				throw new Error( 2 );
				//return Promise.resolve();
			}
		}

		class ThreeWidget extends Widget {
			run() {
				return new Promise( ( fnResolve ) => {
					setTimeout( () => {
						this.bl().textContent = 'three';
						fnResolve();
					}, 3 );
				} );
			}
		}

		oLinker.setWidgets( {OneWidget, TwoWidget, ThreeWidget} );

		await oHelper.addHtmlAllSettled(
			'<div class="_ _OneWidget">' +
			'<div class="_ _TwoWidget"></div>' +
			'<div class="three _ _ThreeWidget"></div>' +
			'</div>',
			true
		)
		const oThree = oHelper.widget( '.three', ThreeWidget );
		expect( oThree.bl().textContent ).toBe( 'three' );
		fnDone();
	} );
} );
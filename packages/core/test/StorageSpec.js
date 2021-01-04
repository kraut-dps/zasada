import oRoot, {Widget} from "./_support/bootstrap.js";

let oStorage, oHelper, oLinker;
describe( "Storage", () => {

	beforeAll( ( fnDone ) => {
		oRoot.core.init( ( oLinkerReal ) => {
			oLinker = oLinkerReal;
			oStorage = oRoot.core.oneStorage();
			oHelper = oRoot.test.newHelper();
			fnDone();
		} );
	} );

	it( ".on() .off()", async ( fnDone ) => {

		let fnAddSpy = jasmine.createSpy('spy' );

		class TestWidget extends Widget {
			addItem() {
				return this._html( '', '<div class="_ _ItemWidget">', 'beforeend' );
			}
		}
		class ItemWidget extends Widget {
		}

		oLinker.setWidgets( { TestWidget, ItemWidget } );

		await oHelper.addHtmlAll(
			`<div class="main _ _TestWidget"></div>`
		);

		const oRelQuery = oLinker.newRelQuery().typeOf( ItemWidget );
		const fnHandler = () => {
			fnAddSpy();
		};
		oStorage.on( oRelQuery, 'add',  fnHandler );

		const oMain = oHelper.widget( '.main', TestWidget );
		expect( fnAddSpy.calls.count() ).toEqual( 0 );

		// при добавлении элемента должен вызываться обработчик
		await oMain.addItem();
		expect( fnAddSpy.calls.count() ).toEqual( 1 );
		await oMain.addItem();
		expect( fnAddSpy.calls.count() ).toEqual( 2 );

		// кривой обработчик удалим, другой relQuery
		oStorage.off( {}, 'add', fnHandler );

		// все равно работает
		await oMain.addItem();
		expect( fnAddSpy.calls.count() ).toEqual( 3 );

		// правильный обработчик удалим - все ок, не вызывается
		oStorage.off( oRelQuery, 'add', fnHandler );

		await oMain.addItem();
		expect( fnAddSpy.calls.count() ).toEqual( 3 );

		fnAddSpy.calls.reset();
		fnDone();
	} );
} );
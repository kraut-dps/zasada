import oRoot, {Widget} from "./_support/bootstrap.js";

class WidgetTest extends Widget {
}

let oEl, oHelper;
describe( "El", () => {

	beforeAll( ( fnDone ) => {
		oRoot.core.init( ( oLinker ) => {
			oLinker.setWidgets( { WidgetTest } );
			oHelper = oRoot.test.oneHelper();
			oEl = oRoot.core.oneEl();
			fnDone();
		} );
	} );

	it( "find", async ( fnDone ) => {

		await oHelper.addHtmlAll(
			`<div class="widget _ _WidgetTest _WidgetTest-Bar">
				<div class="_WidgetTest-Foo"></div>
				<div class="_WidgetTest-Foo"></div>
			</div>`
		);

		const oWidget = oHelper.widget( '.widget', WidgetTest );

		const aFoos = oEl.find( oWidget, 'Foo[]' );

		// просто в качестве аргумента не строка а объект
		expect( oEl.find( oWidget, oEl.parse( 'Foo[]' ) ) ).toEqual( aFoos );

		const oElQuery = oRoot.core.newElQuery();
		oElQuery.id( 'Foo' );
		oElQuery.onlyFirst( false );

		// тоже самое, по другому собран объект запроса
		expect( oEl.find( oWidget, oElQuery ) ).toEqual( aFoos );

		// провека на то что в кеше сохранилось
		expect( oEl._findInCache( oWidget, oEl.parse( 'Foo' ) ) ).toEqual( [ aFoos[ 0 ] ] );

		oEl.resetCache( oWidget );
		expect( oEl._findInCache( oWidget, oEl.parse( 'Foo' ) ) ).toEqual( false );

		// теперь с выключенным кешом
		oEl.find( oWidget, '=Bar' );
		expect( oEl._findInCache( oWidget, oEl.parse( 'Bar' ) ) ).toEqual( false );

		// обязательный элемент
		try{
			oEl.find( oWidget, 'NotFound' );
			fail();
		} catch( e ) {}

		try{
			oEl.find( oWidget, 'NotFound?' );
		} catch( e ) {
			fail();
		}

		// проверка withFrom
		expect( oEl.find( oWidget, 'Bar[]' ).length ).toEqual( 1 );
		expect( oEl.find( oWidget, '>Bar[]?' ).length ).toEqual( 0 );

		try{
			oEl.find( oWidget, '[]' );
			fail();
		} catch( e ) {}

		fnDone();
	} );

	describe( ".parse()", () => {

		it( "only blockId", () => {
			let { sId, bOnlyFirst, bCanEmpty } = oEl.parse( 'BlockId' );
			expect( sId ).toBe( 'BlockId' );
			expect( bOnlyFirst ).toBe( true );
			expect( bCanEmpty ).toBe( false );
		} );

		it( "all", () => {
			let { sId, bOnlyFirst, bCanEmpty } = oEl.parse( 'BlockId[]' );
			expect( sId ).toBe( 'BlockId' );
			expect( bOnlyFirst ).toBe( false );
			expect( bCanEmpty ).toBe( false );
		} );
		
		it( "canEmpty", () => {
			let { sId, bOnlyFirst, bCanEmpty } = oEl.parse( 'BlockId?' );
			expect( sId ).toBe( 'BlockId' );
			expect( bOnlyFirst ).toBe( true );
			expect( bCanEmpty ).toBe( true );
		} );

		it( "canEmptyAll", () => {
			let { sId, bOnlyFirst, bCanEmpty } = oEl.parse( 'BlockId[]?' );
			expect( sId ).toBe( 'BlockId' );
			expect( bOnlyFirst ).toBe( false );
			expect( bCanEmpty ).toBe( true );
		} );
		
		it( "bad queue", ( done ) => {
			try{
				oEl.parse( '%BlockId]' );
				fail();
			} catch( e ) {
				done();
			}
		} );
	} );
} );
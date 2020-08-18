import oDeps from "zasada/tests/_support/deps.js";
import {RootBox, Widget as WidgetBase} from "zasada/src/index.js";

/**
 *  @type {IStorage}
 */
let oStorage;
let eSupParent, eParent, eBase, eChild, eSubChild, eOut, eOther;
let oSupParentWidget, oParentWidget, oBaseWidget, oChildWidget, oSubChildWidget, oOtherWidget, oHelper;

class Widget extends WidgetBase {
	_getIndex() {
		return this.bl().id;
	}
}
class OtherWidget extends WidgetBase {
	_getIndex() {
		return 'other';
	}
}

describe( "RelQuery", () => {

	beforeAll( ( fnDone ) => {
		const oRoot = new RootBox( oDeps );
		oRoot.box( 'core' ).polyfills( () => {
			oRoot.box( 'core' ).oneLinker().setWidgets( { Widget } );
			oStorage = oRoot.box( 'core' ).oneStorage();
			oHelper = oRoot.box( 'test' ).newHelper();
			fnDone();
		} );
	} );

	describe( "general", () => {
		beforeAll( async () => {
			await oHelper.addHtml(  )
			document.body.insertAdjacentHTML(
				'afterbegin',
				`<div id="supparent" class="_ _supparent">
					<div id="parent" class="_ _parent">
						<div id="base" class="_ _base">
							<div id="child" class="_ _child">
								<div id="subchild" class="_ _subchild">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="out" class="_out"></div>
				<div id="other" class="_other"></div>`
			);
			eSupParent = document.getElementById( 'supparent' );
			eParent = document.getElementById( 'parent' );
			eBase = document.getElementById( 'base' );
			eChild = document.getElementById( 'child' );
			eSubChild = document.getElementById( 'subchild' );
			eOut = document.getElementById( 'out' );
			eOther = document.getElementById( 'other' );

			oSupParentWidget = new Widget( eSupParent, 'supparent' );
			oParentWidget = new Widget( eParent, 'parent' );
			oBaseWidget = new Widget( eBase, 'base' );
			oChildWidget = new Widget( eChild, 'child' );
			oSubChildWidget = new Widget( eSubChild, 'subchild' );
			oOtherWidget = new OtherWidget( eOther, 'other' );
			oStorage.add( oSupParentWidget );
			oStorage.add( oParentWidget );
			oStorage.add( oBaseWidget );
			oStorage.add( oChildWidget );
			oStorage.add( oSubChildWidget );
			oStorage.add( oSubChildWidget );
			oStorage.add( oOtherWidget );

		} );
		
		it( "add", () => {

			expect(
				oStorage.query()
					.from( eBase )
					.withFrom()
					.typeOf( Widget )
					.cssSel( '#base' )
					.find()
			).toEqual( oBaseWidget );

			expect(
				oStorage.query()
					.from( eBase )
					.withFrom()
					.typeOf( Widget )
					.cssSel( '#base' )
					.find()
			).toEqual( oBaseWidget );

			expect(
				oStorage.query()
					.from( eBase )
					.withFrom( false )
					.typeOf( Widget )
					.cssSel( '#base' )
					.canEmpty( true )
					.find()
			).toEqual( null );

			// неподходящий css
			expect(
				oStorage.query()
					.typeOf( Widget )
					.cssSel( '.undefined' )
					.canEmpty( true )
					.find()
			).toEqual( null );

			expect(
				oStorage.query()
					.children( eBase, false )
					.typeOf( Widget )
					.blockId( 'child' )
					.find()
			).toEqual( oChildWidget );

			expect(
				oStorage.query()
					.from( eBase )
					.children()
					.typeOf( Widget )
					.blockId( 'child' )
					.find()
			).toEqual( oChildWidget );
			
			expect(
				oStorage.query()
					.parents( eBase, false )
					.typeOf( Widget )
					.find( true )
			).toEqual( [ oParentWidget, oSupParentWidget ] );


			// просто проверка что не произойдет никакого ненужного Error
			oStorage.drop( eOut, false );

			// удалим все после eChild
			/*oLom.drop( eChild, false );
			//eChild.innerHTML = '';

			expect( oLom.find( eBase, 1, 0, 1, CoreWidget, [ 'child' ] ) ).toEqual( [oChildWidget] );

			expect( oLom.find( eBase, 1, 0, 1, CoreWidget, [ 'subchild' ] ) ).toEqual( [] );
			*/

		} );

		it( "index", () => {

			// находится по индексу, но не находится по css селектору
			expect(
				oStorage.query()
					.index( [ 'other' ] )
					.cssSel( '.undefined' )
					.canEmpty( true )
					.find()
			).toEqual( null );

			expect(
				oStorage.query()
					.children( eBase, false )
					.typeOf( Widget )
					.blockId( [ 'child', 'subchild' ] )
					.index( [ 'subchild' ] )
					.find()
			).toEqual( oSubChildWidget );

			expect(
				oStorage.query()
					.children( eBase, false )
					.index( [ 'subchild' ] )
					.find( true )
			).toEqual( [ oSubChildWidget ] );

			expect(
				oStorage.query()
					.parents( eBase, false )
					.typeOf( Widget )
					.blockId( [ 'child', 'subchild' ] )
					.index( 'subchild' )
					.canEmpty( true )
					.find()
			).toEqual( null );

			expect(
				oStorage.query()
					.from( eBase )
					.parents()
					.typeOf( Widget )
					.blockId( [ 'child', 'subchild' ] )
					.index( 'subchild' )
					.canEmpty( true )
					.find()
			).toEqual( null );


			// тоже самое, но  с ошибкой
			try {
				oStorage.query()
					.index( 'unknown_index' )
					.find();
				fail();
			} catch( e ) {}

		} );

	} );

	describe( "reindex", () => {
		it( "add", async () => {

			await oHelper.addHtml(
				`<div id="index" class="one _ _Widget"></div>
					<div id="index" class="two _ _Widget"></div>`
			);

			const oOne = oHelper.widget( '.one', Widget );
			const oTwo = oHelper.widget( '.two', Widget );

			expect(
				oOne.rel()
					.index( "index" )
					.find()
			).toEqual( oTwo );

			const eTwo = oTwo.bl();
			eTwo.parentNode.removeChild( eTwo );

			oStorage.reindex( document.body );
			oStorage.reindex( document.body, false );
			expect(
				oTwo.rel()
					.index( "index" )
					.find()
			).toEqual( oOne );

		} );
	} );

} );
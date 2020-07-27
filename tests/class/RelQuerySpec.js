import {Widget as WidgetBase} from '../../src/Widget.js';
import {TestMainBox} from "../_support/main/TestMainBox.js";

/**
 *  @type {IStorage}
 */
let oStorage;
let eSupParent, eParent, eBase, eChild, eSubChild, eOut;
let oSupParentWidget, oParentWidget, oBaseWidget, oChildWidget, oSubChildWidget;

class Widget extends WidgetBase {
	index() {
		return this.bl().id;
	}
}

describe( "RelQuery", () => {

	beforeAll( ( hDone ) => {
		const oApp = new TestMainBox();
		oStorage = oApp.oneCoreBox().oneStorage();
		oApp.basePolyfills( hDone );
	} );

	describe( "general", () => {
		beforeAll( () => {
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
				<div id="out" class="_out"></div>`
			);
			eSupParent = document.getElementById( 'supparent' );
			eParent = document.getElementById( 'parent' );
			eBase = document.getElementById( 'base' );
			eChild = document.getElementById( 'child' );
			eSubChild = document.getElementById( 'subchild' );
			eOut = document.getElementById( 'out' );
		} );
		
		it( "add", () => {
			oSupParentWidget = new Widget( eSupParent, 'supparent' );
			oParentWidget = new Widget( eChild, 'parent' );
			oBaseWidget = new Widget( eBase, 'base' );
			oChildWidget = new Widget( eChild, 'child' );
			oSubChildWidget = new Widget( eSubChild, 'subchild' );
			oStorage.add( oSupParentWidget );
			oStorage.add( oParentWidget );
			oStorage.add( oBaseWidget );
			oStorage.add( oChildWidget );
			oStorage.add( oSubChildWidget );

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
					.find( true )
			).toEqual( [ oBaseWidget ] );

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
					.find()
			).toEqual( oSubChildWidget );
			
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


			// просто проверка что не произойдет никакого ненужного Error
			/*oLom.drop( eOut, false );

			// удалим все после eChild
			oLom.drop( eChild, false );
			//eChild.innerHTML = '';

			expect( oLom.find( eBase, 1, 0, 1, Widget, [ 'child' ] ) ).toEqual( [oChildWidget] );

			expect( oLom.find( eBase, 1, 0, 1, Widget, [ 'subchild' ] ) ).toEqual( [] );
			*/

		} );
	} );
} );
import oRoot from "./_support/bootstrap.js";

let oHelper, oDom, eBase, aNodes, aIds;

const fnGetIds = ( aNodes ) => {
	let aRet = [];
	for( let i in aNodes ) {
		aRet.push( aNodes[ i ].id );
	}
	return aRet;
}

describe( "Dom", () => {

	beforeAll( ( fnDone ) => {
		oRoot.core.init( () => {
			oHelper = oRoot.test.oneHelper();
			oDom = oRoot.core.oneDom();
			fnDone();
		} );
	} );

	describe( ".children()", () => {
		beforeAll( async() => {
			await oHelper.addHtmlAll( `<div id="base" class="all">
					<div id="child" class="all">
						<div id="subchild" class="all">
						</div>
					</div>
				</div>`
			);
			eBase = oHelper.element( '#base' );
		} );
		
		it( "with self all", () => {
			aNodes = oDom.children( eBase, '.all', 1, 0 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['base', 'child', 'subchild'] );
		} );
		it( "with self first", () => {
			aNodes = oDom.children( eBase, '.all', 1, 1 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['base'] );
		} );
		it( "with self none", () => {
			aNodes = oDom.children( eBase, '.unknown', 1, 1 );
			expect( aNodes ).toEqual( [] );
		} );
		it( "without self all", () => {
			aNodes = oDom.children( eBase, '.all', 0, 0 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['child', 'subchild'] );
		} );
		it( "without self first", () => {
			aNodes = oDom.children( eBase, '.all', 0, 1 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['child'] );
		} );
	} );
	
	describe( ".parents()", () => {
		beforeAll( async() => {
			oHelper.addHtmlAll(
				`<div id="supparent" class="all">
				  <div id="parent" class="all">
					<div id="base" class="all">
					</div>
				  </div>
				</div>`
			);
			eBase = oHelper.element( '#base' );
		} );
		
		it( "with self all", () => {
			aNodes = oDom.parents( eBase, '.all', 1, 0 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['base', 'parent', 'supparent'] );
		} );
		it( "with self first", () => {
			aNodes = oDom.parents( eBase, '.all', 1, 1 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['base'] );
		} );
		it( "with self none", () => {
			aNodes = oDom.parents( eBase, '.unknown', 1, 1 );
			expect( aNodes ).toEqual( [] );
		} );
		it( "without self all", () => {
			aNodes = oDom.parents( eBase, '.all', 0, 0 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['parent', 'supparent'] );
		} );
		it( "without self first", () => {
			aNodes = oDom.parents( eBase, '.all', 0, 1 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['parent'] );
		} );
		it( "document", () => {
			aNodes = oDom.parents( document, '.all', 0, 1 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( [] );
		} );
	} );

	describe( ".prevs() .nexts()", () => {
		beforeAll( async() => {
			oHelper.addHtmlAll(
				`<div id="prev" class="all"></div>
					<div id="base" class="all"></div>
				  <div id="next" class="all"></div>`
			);
			eBase = oHelper.element( '#base' );
		} );

		it( "nexts", () => {
			aNodes = oDom.nexts( eBase, '.all', 0, 1 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['next'] );
		} );
		it( "prevs", () => {
			aNodes = oDom.prevs( eBase, '.all', 0, 1 );
			aIds = fnGetIds( aNodes );
			expect( aIds ).toEqual( ['prev'] );
		} );
	} );
	
	describe( ".parseBlockIds()", () => {
		beforeAll( async() => {
			await oHelper.addHtmlAll(
				`<div class="base _BlockId Block _BlockId-ElementId _BlockId2-ElementId2 _BlockId3_Block _OtherBlockId"></div>`
			);
			eBase = oHelper.element( '.base' );
		} );
		
		it( "base", () => {
			const aBlockIds = oDom.parseBlockIds( eBase );
			expect( aBlockIds ).toEqual( ['BlockId', 'OtherBlockId'] );
		} );

		it( "document", () => {
			const aBlockIds = oDom.parseBlockIds( document );
			expect( aBlockIds ).toEqual( [] );
		} );
	} );
	
	describe( ".sel()", () => {
		it( "base", () => {
			expect( oDom.sel() ).toBe( '._' );
			expect( oDom.sel( 'BlockId' ) ).toBe( '._BlockId' );
			expect( oDom.sel( 'BlockId', 'ElementId' ) ).toBe( '._BlockId-ElementId' );
		} );
	} );
} );
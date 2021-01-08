import oRoot from "./_support/bootstrap.js";
import {Btn as BtnOrigin} from '../src/widget/Btn.js';
import {Area as AreaOrigin} from '../src/widget/Area.js';
import {Frame as FrameOrigin} from '../src/widget/Frame.js';


// для упрощения тестов добавим спец события
class Btn extends BtnOrigin {
	_parseOpts( eBtn, oEvent ) {
		const oOpts = super._parseOpts( eBtn, oEvent );
		this._fire( "", 'opts', { oOpts } );
		return oOpts;
	}
}
class Area extends AreaOrigin {
	_parseOpts( eBtn, oEvent ) {
		const oOpts = super._parseOpts( eBtn, oEvent );
		this._fire( "", 'opts', { oOpts } );
		return oOpts;
	}
}

class Frame extends FrameOrigin {
	reload() {
		this._fire( "", 'reload' );
		//return super.reload();
	}
}


let oHelper;
describe( "Btn", () => {

	beforeAll( ( fnDone ) => {

		oRoot.frame.Btn = Btn;
		oRoot.frame.Area = Area;
		oRoot.frame.Frame = Frame;
		oRoot.core.init( () => {
			oRoot.frame.init();
			oHelper = oRoot.test.oneHelper();
			fnDone();
		} )
	} );

	beforeEach( () => {
		jasmine.Ajax.install();
	} );

	afterEach( () => {
		jasmine.Ajax.uninstall();
	} );

	describe( "props", () => {

		it( "area", async ( fnDone ) => {

			await oHelper.addHtml(
				`<div class="area _ _Area" data-post="0" data-frame-id="form" data-url="link0">
					<a class="link" href="link1" data-post="1">link1</a>
					<a class="link-div" href="link2" data-scroll="1">
						<div class="link-div-content">link</div>
					</a>
				</div>
				<div class="form-frame _ _Frame" data-frame-id="form"></div>`,
			);

			const oAreaWidget = oHelper.widget( '.area', Area );

			await new Promise( ( fnResolve ) => {

				const eLink = oHelper.element( '.link' );
				oAreaWidget._on( "", 'opts', ( oEvent ) => {
					const oOpts = oEvent.detail.oOpts;
					if( oOpts.eBtn === eLink ) {
						expect( oOpts[ 'bPost' ] ).toBe( true );
						fnResolve();
					}
				} );
				eLink.click();
			} );

			await new Promise( ( fnResolve ) => {

				const eLink = oHelper.element( '.link-div' );
				oAreaWidget._on( "", 'opts', ( oEvent ) => {
					const oOpts = oEvent.detail.oOpts;
					if( oOpts.eBtn === eLink ) {
						expect( oOpts[ 'bScroll' ] ).toBe( true );
						fnResolve();
					}
				} );
				eLink.click();
			} );

			fnDone();
		} );

		it( "btns", async ( fnDone ) => {

			await oHelper.addHtml(
				`<div class="btn _ _Btn" data-post="0" data-frame-id="form">
					<a class="link _Btn-Btn" href="link" data-post="1">link</a>
				</div>
				<div class="form-frame _ _Frame" data-frame-id="form"></div>`,
			);

			const oBtnWidget = oHelper.widget( '.btn', Btn );
			oBtnWidget._on( "", 'opts', ( oEvent ) => {
				const oOpts = oEvent.detail.oOpts;
				expect( oOpts[ 'bPost' ] ).toBe( true );
				fnDone();
			} );
			const eLink = oHelper.element( '.link' );
			eLink.click();
		} );

	} );
} );
import oRoot from "./_support/bootstrap.js";
import {History} from "../src/widget/History.js";
import {Frame} from '../src/widget/Frame.js';
import { Widget } from "@zasada/widget";

class HistoryAdapter {

	/**
	 * @type {function(): IRelQuery}
	 */
	newRelQuery;
	aStack = [];
	iPointer = 0;

	_fnPopState;

	isEnabled() {
		return true;
	}

	pushState( mStateId, sTitle, sUrl ) {
		this.iPointer++;
		this.aStack[ this.iPointer ] = { mStateId, sTitle, sUrl };
		this._change();
	}

	replaceState( mStateId, sTitle, sUrl ) {
		this.aStack[ this.iPointer ] = { mStateId, sTitle, sUrl };
		this._change();
	}

	onPopState( fnHandler ) {
		this._fnPopState = fnHandler;
	}

	back() {
		this.iPointer--;
		this._change();
		this._fnPopState( { state: this.aStack[ this.iPointer ][ 'mStateId' ] } );
	}

	next() {
		this.iPointer++;
		this._change();
		this._fnPopState( { state: this.aStack[ this.iPointer ][ 'mStateId' ] } );
	}

	_change() {
		const oHa = this.newRelQuery()
			.typeOf( HistoryAdapterWidget )
			.onlyFirst()
			.find();
		oHa.change( this );
	}
}

class HistoryAdapterWidget extends Widget {

	/**
	 * @param {HistoryAdapter} oHistoryAdapter
	 */
	change( oHistoryAdapter ) {
		this._el( 'Url' ).textContent = oHistoryAdapter.aStack[ oHistoryAdapter.iPointer ][ 'sUrl' ];
		let sStackHtml = '';
		for( let i = 0; i < oHistoryAdapter.aStack.length; i++ ) {
			sStackHtml += '<div' + ( i === oHistoryAdapter.iPointer ? ' style="color:green;"' : '' ) + '>' + JSON.stringify( oHistoryAdapter.aStack[ i ] ) + '</div>'
		}
		this._el( 'Stack' ).innerHTML = sStackHtml;
	}
}

let oHelper, oHistoryAdapter;

describe( "History", () => {

	beforeAll( ( fnDone ) => {

		oRoot.core.polyfills( () => {

			oRoot.frame.init();
			oRoot.core.oneLinker().setOpts( {
				History: {
					/** @param {History} oWidget */
					fnAfterNew: ( oWidget ) => {
						oWidget.aPathParts = [ 'main', 'one', 'two' ];
						oWidget.oneHistoryAdapter = () => {
							if( !oHistoryAdapter ) {
								oHistoryAdapter = new HistoryAdapter();
								oHistoryAdapter.newRelQuery = oRoot.core.newRelQuery;
							}
							return oHistoryAdapter;
						};
					}
				},
			} );
			oRoot.core.oneLinker().setWidgets( { HistoryAdapterWidget } );
			oHelper = oRoot.test.oneHelper();
			fnDone();
		} );
	} );

	beforeEach( () => {
		jasmine.Ajax.install();
	} );

	afterEach( () => {
		oHelper.destroy();
		jasmine.Ajax.uninstall();
	} );

	it( "simple", async() => {
		await oHelper.addHtml(
			`<div class="_ _History _HistoryAdapterWidget">
				<div>url: <span class="url _HistoryAdapterWidget-Url"></span></div>
				<div>stack:
					<div class="_HistoryAdapterWidget-Stack"></div>
				</div>
				<div class="frame _ _Frame" data-frame-id="main">
					content url1
				</div>
			</div>`
		);
		const oFrame = oHelper.widget( '.frame', Frame );
		const eUrl = oHelper.element( '.url' );
		jasmine.Ajax.stubRequest( 'http://localhost/url2', '', 'GET' )
			.andReturn( {
				contentType: 'text/html',
				responseText: 'content url2'
			} );


		await oFrame.update( { sUrl: 'http://localhost/url2' } );

		expect( eUrl.textContent ).toBe( 'http://localhost/url2' );

		oHistoryAdapter.back();

		expect( eUrl.textContent ).toBe( '' );

		oHistoryAdapter.next();

		expect( eUrl.textContent ).toBe( 'http://localhost/url2' )

	} );

	it( "nested", async() => {

		await oHelper.addHtml(
			`<div class="_ _History _HistoryAdapterWidget">
				<div>url: <span class="url _HistoryAdapterWidget-Url"></span></div>
				<div>stack:
					<div class="_HistoryAdapterWidget-Stack"></div>
				</div>
				<div class="frame-one _ _Frame" data-frame-id="one">
					content one1
					<div class="frame-two _ _Frame" data-frame-id="two">content two1</div>
				</div>
			</div>`
		);
		const oFrameOne = oHelper.widget( '.frame-one', Frame );
		const oFrameTwo = oHelper.widget( '.frame-two', Frame );
		const eUrl = oHelper.element( '.url' );
		jasmine.Ajax.stubRequest( 'http://localhost/two2', '', 'GET' )
			.andReturn( {
				contentType: 'text/html',
				responseText: 'content two2'
			} );
		await oFrameTwo.update( { sUrl: 'http://localhost/two2' } );

		expect( eUrl.textContent ).toBe( 'http://localhost/two2' );

		jasmine.Ajax.stubRequest( 'http://localhost/one2', '', 'GET' )
			.andReturn( {
				contentType: 'text/html',
				responseText: `content one2
				<div class="frame-two _ _Frame" data-frame-id="two">content two3</div>
				`
			} );
		await oFrameOne.update( { sUrl: 'http://localhost/one2' } );

		oHistoryAdapter.back();
		expect( eUrl.textContent ).toBe( 'http://localhost/two2' );

		oHistoryAdapter.back();
		expect( eUrl.textContent ).toBe( '' );

	} );
} );
import oRoot from "./_support/bootstrap.js";
import {Frame as FrameOrigin} from './../src/widget/Frame.js';

// для упрощения тестов добавим спец события
class Frame extends FrameOrigin {
	_preloadSave( sPreloadUrl, oResponse ) {
		super._preloadSave( sPreloadUrl, oResponse );
		this._fire( '', 'preloadUrlAfter', { sPreloadUrl, oResponse } );
	}
}

let oHelper;
describe( "Frame", () => {

	beforeAll( ( fnDone ) => {
		oRoot.frame.Frame = Frame;
		oRoot.core.polyfills( () => {
			oRoot.frame.init();
			oHelper = oRoot.test.oneHelper();
			fnDone();
		} );
	} );

	beforeEach( () => {
		jasmine.Ajax.install();
	} );

	afterEach( () => {
		jasmine.Ajax.uninstall();
	} );

	it( "props", async() => {
		await oHelper.addHtml( `<div class="frame _ _Frame"
			data-custom-data='{"cus":"data"}'
			data-url="link"></div>` );
		const oFrameWidget = oHelper.widget( '.frame', Frame );
		expect( oFrameWidget.customData() ).toEqual( { cus: "data" } );
		expect( oFrameWidget.url().substr( -4 ) ).toBe( 'link' );
		expect( oFrameWidget.stateId() ).toBe( 1 );
	} );

	it( "static content", async() => {
		await oHelper.addHtml( `<div class="frame _ _Frame"></div>` );
		const oFrameWidget = oHelper.widget( '.frame', Frame );
		expect( oFrameWidget.bl().textContent ).toBe( "" );
		await oFrameWidget.update( { sContent: "static content" } );
		expect( oFrameWidget.bl().textContent ).toBe( "static content" );
	} );

	it( "server content", async() => {
		await oHelper.addHtml( `<div class="frame _ _Frame"></div>` );
		const oFrameWidget = oHelper.widget( '.frame', Frame );

		// просто загрузка контента по ссылке
		jasmine.Ajax.stubRequest( 'http://localhost/link_get', '', 'GET' )
		.andReturn( {
			contentType: 'text/html',
			responseText: "get_content"
		} );
		expect( oFrameWidget.bl().textContent ).toBe( "" );
		await oFrameWidget.update( { sUrl: 'http://localhost/link_get' } );
		expect( oFrameWidget.bl().textContent ).toBe( "get_content" );

		jasmine.Ajax.stubRequest( 'http://localhost/link_post', '', 'POST' )
		.andReturn( {
			contentType: 'text/html',
			responseText: "post_content"
		} );
		await oFrameWidget.update( { sUrl: 'http://localhost/link_post', bPost: true } );
		expect( oFrameWidget.bl().textContent ).toBe( "post_content" );

		// загрузка контента с редиректом
		jasmine.Ajax.stubRequest( 'http://localhost/301' )
		.andReturn( {
			contentType: 'text/html',
			responseText: "301_content",
			responseURL: "http://localhost/other_link"
		} );
		await oFrameWidget.update( { sUrl: 'http://localhost/301' } );
		expect( oFrameWidget.url() ).toBe( "http://localhost/other_link" );
		expect( oFrameWidget.bl().textContent ).toBe( "301_content" );

	} );

	it( "reload", async() => {
		await oHelper.addHtml( `<div class="frame _ _Frame" data-url="http://localhost/link"></div>` );
		const oFrameWidget = oHelper.widget( '.frame', Frame );

		jasmine.Ajax.stubRequest( 'http://localhost/link' )
		.andReturn( {
			contentType: 'text/html',
			responseText: "new_content"
		} );
		expect( oFrameWidget.bl().textContent ).toBe( "" );
		await oFrameWidget.reload();
		expect( oFrameWidget.bl().textContent ).toBe( "new_content" );
	} );

	/**
	 * возможность работать как deferred объект
	 */
	describe( "deferred", () => {

		it( "resolve", async( fnDone ) => {
			await oHelper.addHtml( `<div class="frame _ _Frame"></div>` );
			const oFrameWidget = oHelper.widget( '.frame', Frame );

			oFrameWidget.promise().then( ( oRet ) => {
				expect( oRet ).toEqual( { return: "120" } );
				fnDone();
			} );
			oFrameWidget.resolve( { return: "120" } );
		} );

		it( "reject", async( fnDone ) => {
			await oHelper.addHtml( `<div class="frame _ _Frame"></div>` );
			const oFrameWidget = oHelper.widget( '.frame', Frame );

			oFrameWidget.promise().catch( ( sRet ) => {
				expect( sRet ).toBe( "130" );
				fnDone();
			} );

			oFrameWidget.reject( "130" );
		} );

		// resolve сервером
		it( "resolve by server json", async( fnDone ) => {
			await oHelper.addHtml( `<div class="frame _ _Frame"></div>` );
			const oFrameWidget = oHelper.widget( '.frame', Frame );

			// ответы на запросы к серверу
			jasmine.Ajax.stubRequest( 'http://localhost/url' )
			.andReturn( { responseText: "{\"return\":\"123\"}" } );

			oFrameWidget.promise().then( ( oResponse ) => {
				expect( oResponse ).toEqual( { return: "123" } );
				fnDone();
			} );

			oFrameWidget.update( { sUrl: 'http://localhost/url' } );
		} );

		it( "reject update method", async( fnDone ) => {

			await oHelper.addHtml( `<div class="frame _ _Frame"></div>` );
			const oFrameWidget = oHelper.widget( '.frame', Frame );

			// ответы на запросы к серверу
			jasmine.Ajax.stubRequest( 'http://localhost/json' )
			.andReturn( {
				status: 500,
				contentType: 'application/json',
				responseText: "{\"return\":\"123\"}"
			} );

			oFrameWidget.update( {
				sUrl: 'http://localhost/json'
			} ).catch( () => {
				fnDone();
			} );
		} );
	} );

	/**
	 * возможность кешировать предыдущие состояния в DOM
	 */
	describe( "dom cache", () => {

		it( "base", async() => {
			await oHelper.addHtml( `<div class="frame _ _Frame" data-url="http://localhost/url"></div>` );
			const oFrameWidget = oHelper.widget( '.frame', Frame );
			oFrameWidget.iCacheLen = 0;

			const oLoadEndSpy = jasmine.createSpy( 'loadend' );

			expect( oLoadEndSpy.calls.count() ).toEqual( 0 );

			jasmine.Ajax.stubRequest( 'http://localhost/url' )
				.andCallFunction( ( oStub, oXhr ) => {
					oXhr.addEventListener( 'loadend', () => {
						oLoadEndSpy();
					} );
					oStub.andReturn( {
						contentType: 'text/html',
					} );
				} );

			oFrameWidget.reload();
			oFrameWidget.reload();

			// должно быть два отдельных запроса
			expect( oLoadEndSpy.calls.count() ).toEqual( 2 );
		} );

		it( "toState", async() => {
			await oHelper.addHtml( `<div class="frame _ _Frame">init content</div>` );
			const oFrameWidget = oHelper.widget( '.frame', Frame );
			expect( oFrameWidget.toState( -1 ) ).toBe( false );
			const iInitStateId = oFrameWidget.stateId();
			expect( oFrameWidget.bl().textContent ).toBe( 'init content' );
			oFrameWidget.toState( iInitStateId );
			expect( oFrameWidget.bl().textContent ).toBe( 'init content' );
			jasmine.Ajax.stubRequest( 'http://localhost/url' )
				.andReturn( {
					contentType: 'text/html',
					responseText: "url content"
				} );

			const iUrlStateId = await oFrameWidget.update( { sUrl: 'http://localhost/url' } );
			expect( oFrameWidget.bl().textContent ).toBe( 'url content' );
			oFrameWidget.toState( iInitStateId );
			expect( oFrameWidget.bl().textContent ).toBe( 'init content' );
			oFrameWidget.toState( iUrlStateId );
			expect( oFrameWidget.bl().textContent ).toBe( 'url content' );
		} );

		it( "gcCache", async() => {
			await oHelper.addHtml( `<div class="frame _ _Frame" data-url="http://localhost/url1">init content</div>` );
			const oFrameWidget = oHelper.widget( '.frame', Frame );
			oFrameWidget.iCacheLen = 3;
			const iUrl1StateId = oFrameWidget.stateId();
			jasmine.Ajax.stubRequest( 'http://localhost/url1' )
				.andReturn( {
					contentType: 'text/html',
					responseText: "url1 content"
				} );
			jasmine.Ajax.stubRequest( 'http://localhost/url2' )
				.andReturn( {
					contentType: 'text/html',
					responseText: "url2 content"
				} );
			jasmine.Ajax.stubRequest( 'http://localhost/url3' )
				.andReturn( {
					contentType: 'text/html',
					responseText: "url3 content"
				} );
			jasmine.Ajax.stubRequest( 'http://localhost/url4' )
				.andReturn( {
					contentType: 'text/html',
					responseText: "url4 content"
				} );

			const iUrl2StateId = await oFrameWidget.update( { sUrl: 'http://localhost/url2' } );
			const iUrl3StateId = await oFrameWidget.update( { sUrl: 'http://localhost/url3' } );
			const iUrl4StateId = await oFrameWidget.update( { sUrl: 'http://localhost/url4' } );
			await oFrameWidget.update( { sUrl: 'http://localhost/url3' } );
			expect( oFrameWidget.hasState( iUrl1StateId ) ).toBe( false );
			await oFrameWidget.update( { sUrl: 'http://localhost/url2' } );
			await oFrameWidget.update( { sUrl: 'http://localhost/url1' } );
			await oFrameWidget.update( { sUrl: 'http://localhost/url2' } );
			expect( oFrameWidget.hasState( iUrl4StateId ) ).toBe( false );
		} );
	} );

	/**
	 * возможность предзагрузки
	 */
	describe( "preload", () => {

		it( "base", async( fnDone ) => {

			const aRequests = [];

			// функция сброса jasmine stubRequest
			const fnResetStub = () => {
				jasmine.Ajax.stubRequest( /preload\d/ )
					.andCallFunction( ( oRequest, oXhr ) => {
						aRequests.push( oXhr.url );
						oRequest.andReturn( {
							contentType: 'text/html',
						} );
					} );
			};
			fnResetStub();

			await oHelper.addHtml( `<div class="frame _ _Frame"></div>` );
			const oFrameWidget = oHelper.widget( '.frame', Frame );

			oFrameWidget._on( '', 'preloadUrlAfter', ( oEvent ) => {

				// после каждой предзагрузки, сбрасываем stub
				fnResetStub();

				if( oEvent.detail.sPreloadUrl === 'http://localhost/preload2' ) {

					// тут окажемся когда предзагрузим preload2
					oFrameWidget.update( { sUrl: 'http://localhost/preload1' } ).then( () => {
						expect( aRequests ).toEqual( [ 'http://localhost/preload1', 'http://localhost/preload2' ] );
						fnDone();
					} );
				}
			} );

			oFrameWidget.preloadUrls( [ 'http://localhost/preload1', 'http://localhost/preload2' ] );
		} );
	} );

	// добавляем предзагрузку в процессе
	it( "add in progress", async( fnDone ) => {

		const aRequests = [];

		// функция сброса jasmine stubRequest
		const fnResetStub = () => {
			jasmine.Ajax.stubRequest( /.*preload\d/ )
				.andCallFunction( ( oRequest, oXhr ) => {
					aRequests.push( oXhr.url );
					oRequest.andReturn( {
						contentType: 'text/html',
					} );
				} );
		};
		fnResetStub();

		await oHelper.addHtml( `<div class="frame _ _Frame"></div>` );
		const oFrameWidget = oHelper.widget( '.frame', Frame );

		oFrameWidget._on( '', 'preloadUrlAfter', ( oEvent ) => {

			// после каждой предзагрузки, сбрасываем stub
			fnResetStub();

			if( oEvent.detail.sPreloadUrl === 'http://localhost/preload3' ) {
				// тут окажемся когда предзагрузим preload2
				oFrameWidget.update( { sUrl: 'http://localhost/preload1' } ).then( () => {
					expect( aRequests ).toEqual( [ 'http://localhost/preload1', 'http://localhost/preload2', 'http://localhost/preload3' ] );
					fnDone();
				} );
			}
		} );

		oFrameWidget.preloadUrls( [ 'http://localhost/preload1' ] );
		oFrameWidget.preloadUrls( [ 'http://localhost/preload2', 'http://localhost/preload3' ] );
	} );

	/**
	 * возможность кешировать результаты
	 */
	describe( "cache", () => {

		it( "initUrl", ( fnDone ) => {

			oHelper.addHtml(
				`<div class="frame _ _Frame" data-frame-id="frame"></div>`
			).then( () => {

				const oFrameWidget = oHelper.widget( '.frame', Frame );
				expect( oFrameWidget.sUrl ).toBe( location.href );
				fnDone();
			} );
		} );

		it( "base", ( fnDone ) => {

			oHelper.addHtml(
				`<div class="frame _ _Frame" data-frame-id="frame" data-url="http://localhost/url1"></div>`
			).then( () => {

				const oFrameWidget = oHelper.widget( '.frame', Frame );

				oFrameWidget.update(
					{
						bCache: true,
						sUrl: 'http://localhost/url2'
					}
				).then( () => {

					oFrameWidget._on( '', 'toStateFromCache', fnDone );
					oFrameWidget.update(
						{
							bCache: true,
							sUrl: 'http://localhost/url1'
						}
					);
				} );

				expect( jasmine.Ajax.requests.mostRecent().url ).toBe( 'http://localhost/url2' );
				jasmine.Ajax.requests.mostRecent().respondWith( {
					"status": 200,
					contentType: 'text/html',
				} );
			} );
		} );
	} );
} );
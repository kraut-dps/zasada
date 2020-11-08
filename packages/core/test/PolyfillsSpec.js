import oRoot, {Widget} from "./_support/bootstrap.js";

let oOrigins = {};

describe( "Polyfills", () => {

	beforeEach( () => {
		oOrigins = {
			Promise: window.Promise,
			WeakMap: window.WeakMap,
			Proto: Object.__proto__,
			CustomEvent: window.CustomEvent,
			contains: window.DOMTokenList.prototype.contains,
			add: window.DOMTokenList.prototype.add,
			toggle: window.DOMTokenList.prototype.toggle
		}
	} );

	afterEach( () => {

		window.Promise = oOrigins.Promise;
		window.WeakMap = oOrigins.WeakMap;
		Object.__proto__ = oOrigins.Proto;
		window.CustomEvent = oOrigins.CustomEvent;
		window.DOMTokenList.prototype.contains = oOrigins.contains;
		window.DOMTokenList.prototype.add = oOrigins.add;
		window.DOMTokenList.prototype.toggle = oOrigins.toggle;

	} );


	it( "simple", async ( fnDone ) => {

		// почистим window от нормальных реализаций, чтобы загрузились полифилы
		window.Promise = null;
		window.WeakMap = null;
		Object.__proto__ = null;
		window.CustomEvent = null;
		window.DOMTokenList.prototype.contains = () => { return false };

		class PolyfillWidget extends Widget {
			run() {
				fnDone();
			}
		}

		// рабочий тестовый url для подгрузки полифилла
		oRoot.core.oPolyfills.sPromiseUrl = '/base/packages/core/src/utils/polyfillPromise.js';
		oRoot.core.polyfills( () => {
			const oLinker = oRoot.core.oneLinker();
			const oHelper = oRoot.test.oneHelper();
			oLinker.setWidgets( { PolyfillWidget } );
			oHelper.addHtml( '<div class="_ _PolyfillWidget"></div>' );
		} );
	} );

	it( "simple classList 2", async ( fnDone ) => {

		let bSet = true;
		// особая логика, чтобы закрыть coverage Polyfills метода ElementClassList 100%
		window.DOMTokenList.prototype.add = () => {};
		window.DOMTokenList.prototype.toggle = () => { bSet = false };
		window.DOMTokenList.prototype.contains = () => { return bSet };

		class PolyfillClassListWidget extends Widget {
			run() {
				fnDone();
			}
		}

		// рабочий тестовый url для подгрузки полифилла
		oRoot.core.oPolyfills.sPromiseUrl = '/base/packages/core/src/utils/polyfillPromise.js';
		oRoot.core.polyfills( () => {
			const oLinker = oRoot.core.oneLinker();
			const oHelper = oRoot.test.oneHelper();
			oLinker.setWidgets( { PolyfillClassListWidget } );
			oHelper.addHtml( '<div class="_ _PolyfillClassListWidget"></div>' );
		} );
	} );

	it( "bad promise polyfill url", ( fnDone ) => {

		const cPromiseOrigin = window.Promise;
		const fnOnErrorOrigin = window.onerror;

		window.onerror = ( message ) => {
			if( message.indexOf( 'badUrl.js' ) !== -1 ) {
				window.Promise = cPromiseOrigin;
				window.onerror = fnOnErrorOrigin
				fnDone();
			}
		};

		// почистим window от нормальных реализаций, чтобы загрузились полифилы
		window.Promise = null;

		// подставим кривой урл с Promise polyfill, проверим срабатываение ошибки
		oRoot.core.oPolyfills.sPromiseUrl = '/badUrl.js';
		oRoot.core.init( fail );
	} );
} );
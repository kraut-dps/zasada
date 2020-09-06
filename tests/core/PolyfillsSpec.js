import oDeps from "./../_support/deps.js";
import {RootBox} from "di-box";
import {Widget} from "./../../src/index.js";

describe( "Polyfills", () => {

	it( "simple", async ( fnDone ) => {

		// почистим window от нормальных реализаций, чтобы загрузились полифилы
		window.Promise = null;
		window.WeakMap = null;
		Object.__proto__ = null;
		window.CustomEvent = null;
		window.DOMTokenList.prototype.contains = () => { return false };

		class TestWidget extends Widget {
			run() {
				fnDone();
			}
		}

		const oRoot = new RootBox( oDeps );

		// рабочий тестовый url для подгрузки полифилла
		oRoot.box( 'core' ).oPolyfills.sPromiseUrl = '/base/src/utils/polyfillPromise.js';
		oRoot.box( 'core' ).polyfills( () => {
			const oLinker = oRoot.box( 'core' ).oneLinker();
			const oHelper = oRoot.box( 'test' ).oneHelper();
			oLinker.setWidgets( { TestWidget } );
			oHelper.addHtml( '<div class="_ _TestWidget"></div>' );
		} );
	} );

	it( "bad promise polyfill url", ( fnDone ) => {

		const cOriginPromise = window.Promise;

		// почистим window от нормальных реализаций, чтобы загрузились полифилы
		window.Promise = null;

		window.onerror = ( message, sourceURL, line, column, error ) => {
			window.Promise = cOriginPromise;
			fnDone();
		}

		const oRoot = new RootBox( oDeps );

		// подставим кривой урл с Promise polyfill, проверим срабатываение ошибки
		oRoot.box( 'core' ).oPolyfills.sPromiseUrl = '/badUrl.js';
		oRoot.box( 'core' ).init( fail );
	} );
} );
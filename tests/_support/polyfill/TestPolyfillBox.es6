import {PolyfillBox} from "zasada/src/polyfill/PolyfillBox.es6";
import {Mozilla} from "zasada/src/polyfill/polyfill/mozillaPolyfills.es6";
export class TestPolyfillBox extends PolyfillBox{

	Promise( hResolve ) {
		if ( window.Promise ) {
			hResolve();
		} else {
			this.importExt(
				'/base/node_modules/yaku/lib/yaku.js ',
				() => {
					window.Promise = window.Yaku;
					hResolve();
				},
				( mError ) => {
					throw new Error( mError );
				}
			);
		}
	}
	
	ObjectProto() {
		return Promise.resolve(
			( "__proto__" in Object )
			||
			this.importExt( '/base/node_modules/proto-polyfill/index.js' )
		);
	}
	
	WeakMap() {
		return Promise.resolve(
			window.WeakMap
			||
			this.importExt( '/base/node_modules/weakmap-polyfill/weakmap-polyfill.js' )
		);
	}

	ElementClassList() {
		let bCheck = true;
		try {
			const eTest = document.createElement( "_" ), sClass = 'c';
			eTest.classList.toggle( sClass, false );
			if ( eTest.classList.contains( sClass ) ) {
				throw 1;
			}
		} catch( e ) {
			bCheck = false;
		}
		return Promise.resolve(
			bCheck
			||
			this.importExt( '/base/node_modules/classlist-polyfill/src/index.js' )
		);
	}
}
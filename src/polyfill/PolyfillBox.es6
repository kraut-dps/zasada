import {Box} from "zasada/src/Box.es6";
/**
 * @implements IPolyfillBox
 */
export class PolyfillBox extends Box{
	
	base( fnCallback ) {
		this.Promise( () => {
			Promise.all( [
				this.ObjectProto(),
				this.Mozilla(), // Object.assign, CustomEvent, Element.prototype.matches, Element.prototype.closest
				this.WeakMap(),
				this.ElementClassList()
			] ).then( fnCallback );
		} );
	}
	
	Promise( fnResolve ) {
		if ( window.Promise ) {
			fnResolve();
		} else {
			this.importExt(
				( __webpack_public_path__ || '/' ) + 'promise.js',
				fnResolve,
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
			import( /* webpackChunkName: "polyfill-proto" */ 'proto-polyfill' )
		);
	}

	Mozilla() {
		return Promise.resolve(
			(
				Object.assign
				&&
				typeof window.CustomEvent === 'function'
				&&
				Element.prototype.matches
				&&
				Element.prototype.closest
			)
			||
			import( /* webpackChunkName: "polyfill-mozilla" */ './polyfill/mozillaPolyfills.es6' )
		);
	}

	WeakMap() {
		return Promise.resolve(
			window.WeakMap
			||
			import( /* webpackChunkName: "polyfill-weakmap" */ 'weakmap-polyfill' )
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
			import( /* webpackChunkName: "polyfill-classlist" */ 'classlist-polyfill' )
		);
	}
}
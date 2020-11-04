import {importExt} from "../utils/importExt.js";
/**
 * @typedef {import('./../interfaces').IPolyfills} IPolyfills
 */
/**
 * @implements IPolyfills
 */
export class Polyfills{

	sPromiseUrl;
	pProto;
	pMozilla;
	pWeakMap;
	pClassList;

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
			importExt( this.sPromiseUrl, fnResolve );
		}
	}

	ObjectProto() {
		return Promise.resolve(
			( "__proto__" in Object )
			||
			this.pProto()
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
			this.pMozilla()
		);
	}

	WeakMap() {
		return Promise.resolve(
			window.WeakMap
			||
			this.pWeakMap()
		);
	}

	ElementClassList() {
		let bCheck = true;
		try {
			const eTest = document.createElement( "_" ), sClass = 'c';
			// добавим, проверим что добавился
			eTest.classList.add( sClass );
			if ( !eTest.classList.contains( sClass ) ) {
				throw 1;
			}
			// добавим через toggle, проверим что все ок
			eTest.classList.toggle( sClass, true );
			if ( !eTest.classList.contains( sClass ) ) {
				throw 1;
			}
		} catch( e ) {
			bCheck = false;
		}
		return Promise.resolve(
			bCheck
			||
			this.pClassList()
		);
	}
}
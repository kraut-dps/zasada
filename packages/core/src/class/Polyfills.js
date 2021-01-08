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
	pBlob;
	pFormData;

	base( fnCallback ) {
		this.Promise( () => {
			Promise.all( [
				this.ObjectProto(),
				this.Mozilla(), // Object.assign, CustomEvent, Element.prototype.matches, Element.prototype.closest
				this.WeakMap(),
				this.ElementClassList(),
				this.Blob().then( () => this.FormData() )
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

	Blob() {
		// @ts-ignore
		const bIsIe = !!window.document.documentMode;
		let bSupported = false;
		try {
			bSupported = new Blob( [ "ä" ] ).size === 2;
		} catch ( e ) {}

		return Promise.resolve(
			( bSupported && !bIsIe )
			||
			this.pBlob()
		);
	}

	FormData() {
		return Promise.resolve(
			( typeof FormData !== 'undefined' && FormData.prototype.keys )
			||
			this.pFormData()
		);
	}
}
/**
 * @implements IPolyfillBox
 */
export class Polyfills{

	sPromiseUrl;
	pProto;
	pMozilla;
	pWeakMap;
	pClassList;

	base( fnCallback, fnReject ) {
		this.Promise( () => {
			Promise.all( [
				this.ObjectProto(),
				this.Mozilla(), // Object.assign, CustomEvent, Element.prototype.matches, Element.prototype.closest
				this.WeakMap(),
				this.ElementClassList()
			] ).then( fnCallback )
			.catch( fnReject );
		}, fnReject );
	}

	Promise( fnResolve, fnReject ) {
		if ( window.Promise ) {
			fnResolve();
		} else {
			const eScript = document.createElement( "script" );
			const sUrl = this.sPromiseUrl;
			eScript.src = sUrl;
			eScript.type = 'text/javascript';
			eScript.onload = fnResolve;
			eScript.onerror = fnReject;
			eScript.async = true;
			document.body.appendChild( eScript );
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
			eTest.classList.add( sClass );
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
// @ts-nocheck
/*!
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
 */
if( !Object.assign ) {
	Object.defineProperty( Object, "assign", {
		value: function assign( target, varArgs ) { // .length of function is 2
			'use strict';
			if ( target == null ) { // TypeError if undefined or null
				throw new TypeError( 'Cannot convert undefined or null to object' );
			}

			var to = Object( target );

			for ( var index = 1; index < arguments.length; index++ ) {
				var nextSource = arguments[index];

				if ( nextSource != null ) { // Skip over if undefined or null
					for ( var nextKey in nextSource ) {
						// Avoid bugs when hasOwnProperty is shadowed
						if ( Object.prototype.hasOwnProperty.call( nextSource, nextKey ) ) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	} );
}

/*!
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 */
/*if( typeof window.CustomEvent !== 'function' ) {
	function CustomEvent( event, params ) {
		params = params || {bubbles: false, cancelable: false, detail: undefined};
		const evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent;
}

/*!
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */
if( !Element.prototype.matches ) {
	Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function ( s ) {
			var matches = ( this.document || this.ownerDocument ).querySelectorAll( s ), i = matches.length;
			while ( --i >= 0 && matches.item( i ) !== this ) {}
			return i > -1;
		};
}

/*!
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if( !Element.prototype.closest ) {
	Element.prototype.closest = function ( s ) {
		var el = this;
		if ( !document.documentElement.contains( el ) ) return null;
		do {
			if ( el.matches( s ) ) return el;
			el = el.parentElement || el.parentNode;
		} while ( el !== null && el.nodeType === 1 );
		return null;
	};
}
export {};
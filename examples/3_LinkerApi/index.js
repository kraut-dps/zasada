import {RootBox} from "di-box";
import oDeps from "zasada/src/deps.js";
import {Widget} from "zasada/src";


const _fnBody = ( fn ) => {
	const sFullCode = fn.toString();
	// https://stackoverflow.com/questions/3179861/javascript-get-function-body
	const sFnStart = '{';
	return sFullCode.substring( sFullCode.indexOf( sFnStart ) + sFnStart.length, sFullCode.lastIndexOf("}") );
}


const oRootBox = new RootBox( oDeps );
oRootBox.box( 'core' ).init( ( oLinker ) => {

	for( let sExample in window.oExamples ) {
		const eTarget = document.querySelector( '.' + sExample );
		const eBtn = eTarget.querySelector( '.example__btn' );
		eBtn.textContent = _fnBody( oExamples[ sExample ] );
		eBtn.addEventListener( 'click', () => {
			oExamples[ sExample ]( oLinker, Widget );
			oLinker.link( eTarget );
		} );
	}
} );

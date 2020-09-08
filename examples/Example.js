import {Widget} from "zasada/src";

/**
 * виджет для создания окружения примера
 */
export class Example extends Widget {

	_sName;

	run() {
		// название примера
		this._my( { name: '_sName' } );

		const oExample = window.oExamples[ this._sName ];

		// html примера
		this._el( 'Area' ).innerHTML = oExample.sHtml;

		// кнопки
		oExample.aExamples.forEach( ( fnExample ) => {
			const eBtn = document.createElement( 'button' );
			eBtn.className = 'example__btn';
			eBtn.innerHTML = this._fnBodyHtml( fnExample );
			this._on( eBtn, 'click', () => {
				this._exampleExec( fnExample, this._el( 'Area' ) );
			} );
			this._el( 'Btns' ).appendChild( eBtn );
		} )
	}

	_exampleExec( fnExample, eContext ) {
		fnExample();
	}

	_fnBodyHtml( fn ) {
		const sFullCode = fn.toString();
		// https://stackoverflow.com/questions/3179861/javascript-get-function-body
		const sFnStart = '{';
		let sBody = sFullCode.substring( sFullCode.indexOf( sFnStart ) + sFnStart.length, sFullCode.lastIndexOf("}") );
		sBody = sBody.replace( /</g, '&lt;' ).replace( />/g, '&gt;' )
		return sBody;
	}

	static renderExamples( oLinker ) {
		let sHtml = '';
		for( let sExample in window.oExamples ) {
			// для каждого примера отдельный макет
			let sHtmlExample =
				`<div class="example _ _Example" data-name="${sExample}">
	<div class="_Example-Btns"></div>
	<div class="example__area _Example-Area"></div>
</div>`;
			sHtml += sHtmlExample;
		}
		document.querySelector( '.examples' ).innerHTML = sHtml;
		oLinker.link( document );
	}
}
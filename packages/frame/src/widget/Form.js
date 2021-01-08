/**
 * форма, как обычная форма только для отправления вывода во Frame
 * атрибуты
 * data-url или action Url
 * ... те же что и у Btn
 */
import {Widget} from "@zasada/widget";

export class Form extends Widget{

	newValidator;
	
	/**
	 * @var {function():Request}
	 */
	oneRequest;
	
	oDefaultOpts = {};

	oMods = {
		process: 'process',
		success: 'success',
		error: 'error'
	};

	_oValidator;
	
	run() {
		this._on( this.bl(), 'submit', this._onSubmit.bind(this) );
	}
	
	_onSubmit( oEvent ) {
		oEvent.preventDefault();
		this.validate( false )
			.then( ( bValid ) => {
				if( bValid ) {
					this._exec( oEvent );
				}
			} );
	}
	
	validate( bOnlyChanged ) {
		if( !this.newValidator ) {
			return Promise.resolve();
		}
		if( !this._oValidator ) {
			this._oValidator = this.newValidator( this.bl() );
		}
		this._mod( '', this.oMods, 'process' );
		return this._oValidator.validate( bOnlyChanged )
			.then( ( bValid ) => {
				this._mod( '', this.oMods, bValid ? 'success' : 'error' );
				return bValid;
			} )
			.catch( ( e ) => {
				this._mod( '', this.oMods, 'error' );
				// @ts-ignore
				this._el( 'Error' ).textContent = e.message;
				return false;
			} );
	}
	
	_parseOpts( eBtn, oEvent ) {
		const eForm = this.bl();
		const aSources = [];
		if( eBtn ) {
			aSources.push( eBtn );
		}
		aSources.push( eForm );
		const oOpts = { ...this.oDefaultOpts, ...this._attrs( aSources, this.oneRequest().optsMap(), '' ), eBtn, eForm, oEvent };
		this._formOpts( oOpts );
		return oOpts;
	}
	
	_formOpts( oOpts ) {

		/** @type HTMLFormElement */
		// @ts-ignore
		const eForm = this.bl();

		if( typeof oOpts.bPost === 'undefined' ) {
			oOpts.bPost = eForm.method.toLowerCase() === 'post';
		}
		if( typeof oOpts.sUrl === 'undefined' ) {
			oOpts.sUrl = eForm.action;
		}
		oOpts.oFormData = new FormData( eForm );
	}

	_exec( oEvent ) {
		const eBtn = oEvent.submitter;
		this.oneRequest().exec(
			this._parseOpts( eBtn, oEvent ),
			'disabled',
			'confirm',
			'urlBlank',
			'layer',
			'frame',
			'win'
		);
	}
}
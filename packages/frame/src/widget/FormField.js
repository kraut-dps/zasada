import {Widget} from "@zasada/widget";

/**
 * @typedef {import('./../interfaces').IForm} IForm
 */

export class FormField extends Widget {

	cForm;

	bOnChange = false;
	bOnType = false;
	sName = null;
	oMods = {
		process: 'process',
		success: 'success',
		error: 'error'
	};
	_bChanged = false;
	
	/**
	 * @type {IForm}
	 */
	_oFormWidget;


	run() {
		
		this._my( [
			[ 'onchange', 'bOnChange', 'b' ],
			[ 'ontype', 'bOnType', 'b' ],
			[ 'name', 'sName' ],
			[ 'mods', 'oMods', 'mod' ],
		] );
		
		if( !this.sName ) {
			this.sName = this._parseName();
		}

		if( this.bOnChange || this.bOnType ) {
			this._on( 'Input[]', 'change', this.onInputChange.bind(this) );
		}
	}

	onInputChange( oEvent ) {
		this.setChanged();
		this._getForm( oEvent.currentTarget ).validate( true );
	}

	setChanged() {
		if( !this._bChanged && this.bOnType ) {
			this._on( 'Input[]', 'keyup', this.onInputKeyup.bind(this) );
		}
		this._bChanged = true;
	}

	onInputKeyup( oEvent ) {
		this._getForm( oEvent.currentTarget ).validate( true );
	}

	/**
	 * @param oData
	 * @param bOnlyChanged
	 */
	process( oData, bOnlyChanged ) {
		if( !oData.has( this.sName ) || ( bOnlyChanged && !this._bChanged ) ) {
			return;
		}
		this._mod( '', this.oMods, 'process' );
	}

	/**
	 * @param oErrors
	 * @param {Boolean} bOnlyChanged
	 */
	update( oErrors, bOnlyChanged ) {
		if( bOnlyChanged && !this._bChanged ) {
			return false;
		}
		const bError = typeof oErrors[ this.sName ] !== 'undefined',
			sError = bError ? oErrors[ this.sName ] : '';
		this._mod( '', this.oMods, bError ? 'error' : 'success' );
		const eError = this._el( 'Error?' );
		if( !eError ) {
			return sError;
		}
		// @ts-ignore
		eError.textContent = sError;
		return false;
	}

	/**
	 * автоматическое определение названия
	 * @returns {string}
	 */
	_parseName() {
		const aNames = [];
		const aTypes = [];
		// @ts-ignore
		this._el( 'Input[]' ).forEach( ( eInput ) => {
			aNames.push( eInput.getAttribute( 'name' ) );
			aTypes.push( eInput.type );
		} );
		let sName = aNames[ 0 ];
		if( aNames.length === 1 && aTypes[ 0 ] !== 'select-multiple' ) {
			return sName;
		}
		let aName = sName.split( /(?=\[)/ );
		for( let i = aName.length - 1; i >= 2; i-- ) {
			let sCheckName = aName.slice( 0, i ).join( "" );
			let bCheck = true;
			for( let j = 1; j < aNames.length; j++ ) {
				let sItemName = aNames[ j ];
				if( sItemName.indexOf( sCheckName ) !== 0 ) {
					bCheck = false;
					break;
				}
			}
			if( bCheck ) {
				return sCheckName;
			}
		}
		throw new Error( 'problem parse name: ' + aNames.join( "," ) );
	}
	
	/**
	 * @param {HTMLInputElement} eInput
	 * @return {IForm}
	 */
	_getForm( eInput ) {
		if( !this._oFormWidget ) {
			this._oFormWidget = this._rel()
				.from( eInput.form )
				.typeOf( this.cForm )
				.find( false );
		}
		return this._oFormWidget;
	}
}

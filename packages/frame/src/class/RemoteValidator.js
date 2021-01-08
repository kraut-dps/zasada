/**
 * @typedef {import('./../interfaces').IRelQuery} IRelQuery
 */

export class RemoteValidator {

	newXhr;

	/**
	 * @type {function():IRelQuery}
	 */
	newRelQuery;

	cFormField;

	_eForm;
	
	_aFields = null;
	
	constructor( eForm ) {
		this._eForm = eForm;
	}
	
	validate( bOnlyChanged ) {
		
		const oFormData = new FormData( this._eForm );
		this._fieldsProcess( oFormData, bOnlyChanged );
		
		return new Promise( ( fnResolve, fnReject ) => {
			
			if( this._oXhr ) {
				this._oXhr.abort();
			} else {
				this._oXhr = this.newXhr();
			}
			this._oXhr.onreadystatechange = () => {

				if( this._oXhr.readyState !== 4 ) {
					return;
				}

				let bValid;
				try {
					bValid = this._parseResponse( this._oXhr, bOnlyChanged );
				} catch( e ) {
					fnReject( e );
					return;
				}
				fnResolve( bValid );
			};
			this._request( this._oXhr, oFormData, bOnlyChanged );
		} );
	}
	
	_parseResponse( oXhr, bOnlyChanged ) {
		if ( oXhr.status < 200 || oXhr.status >= 400 ) {
			throw new Error( oXhr.responseText );
		}
		const oData = JSON.parse( oXhr.responseText );
		if ( oData.sError ) {
			throw new Error( oData.sError );
		}
		const aErrorNotShow = this._fieldsErrors( oData.oFieldErrors, bOnlyChanged );
		if( aErrorNotShow.length ) {
			throw new Error( aErrorNotShow.join("\n") );
		}
		return Object.keys( oData.oFieldErrors ).length === 0;
	}
	
	_fieldsProcess( oFormData, bOnlyChanged ) {
		this._getFields().forEach( ( oFormField ) => {
			oFormField.process( oFormData, bOnlyChanged );
		} );
	}
	
	_fieldsErrors( oErrors, bOnlyChanged ) {
		let aErrorNotShow = [];
		this._getFields().forEach( ( oFormField ) => {
			let sErrorNotShow = oFormField.update( oErrors, bOnlyChanged );
			if( sErrorNotShow ) {
				aErrorNotShow.push( sErrorNotShow );
			}
		} );
		return aErrorNotShow;
	}
	
	_request( oXhr, oFormData, bOnlyChanged ) {
		oXhr.open( 'POST', this._eForm.action || location.href, true );
		//oXhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
		oXhr.setRequestHeader( 'X-LOM-VALIDATE', 1 );
		oXhr.send( oFormData );
	}
	_getFields() {
		if( this._aFields === null ) {
			this._aFields = this.newRelQuery()
				.child()
				.from( this._eForm )
				.withFrom( false )
				.typeOf( this.cFormField )
				.find( true );
		}
		return this._aFields;
	}
}
/**
 * формирование текстовой версии ошибки
 * @implements ILogRoute
 */
export class RouteString {

	iMaxElementHtml = 100;

	error( oError ) {
		let aMessage = [], oData = oError.data();
		aMessage.push( oData.sMessage );
		const sWidget = this._getWidgetStr( oData.sBlockId, oData.oWidget );
		aMessage.push( 'Widget: ' + sWidget );

		aMessage.push( 'Element: ' + this._elementToStr( oData.eContext ) );

		aMessage.push( 'Stack: ' + oData.sStackMapped );

		if( oData.mOrigin ) {
			aMessage.push( 'Origin: ' + oData.mOrigin );
		}

		this._send( aMessage.join( "\n" ), oData );
	}

	/**
	 * redefine me
	 * @param {string} sMessage
	 * @param {object} oData
	 */
	_send( sMessage, oData ) {
		console.log( sMessage );
	}

	_elementToStr( eElement ) {
		let sHtml = eElement.outerHTML.substr( 0, this.iMaxElementHtml ).trim();
		const iPos = sHtml.indexOf( '>' );
		if( iPos === -1 ) {
			return sHtml + '...';
		} else {
			return sHtml.substr( 0, iPos + 1 );
		}
	}
	
	_getWidgetStr( sBlockId, oWidget ) {
		let sWidget = sBlockId;
		if( oWidget ) {
			sWidget = oWidget.blockId();
		}
		return sWidget;
	}
}
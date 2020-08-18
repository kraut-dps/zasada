/**
 * формирование текстовой версии ошибки
 * @implements ILogRoute
 */
export class RouteString {

	iMaxElementHtml = 100;

	error( oOpts ) {
		const { sError, sStack, oWidget, sBlockId, eContext } = oOpts;
		let aMessage = [];
		aMessage.push( '"' + sError + '"' );
		const sWidget = this._getWidgetStr( sBlockId, oWidget );
		aMessage.push( 'Widget: ' + sWidget );

		aMessage.push( 'Element: ' + this._elementToStr( eContext ) );

		aMessage.push( 'Stack: ' + sStack );

		this._send( { ...oOpts, sWidget, sMessage: aMessage.join( "\n" ) } );
	}

	/**
	 * redefine me
	 * @param {Object} oOpts
	 */
	_send( { sMessage } ) {
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
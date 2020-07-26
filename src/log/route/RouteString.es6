/**
 * формирование текстовой версии ошибки
 * @implements ILogRoute
 */
export class RouteString {

	log( oOpts ) {
		const { sError, sStack, oWidget, sBlockId, eContext } = oOpts;
		let aMessage = [];
		if( sError ) {
			aMessage.push( '"' + sError + '"' );
		}
		const sWidget = this._getWidgetStr( sBlockId, oWidget );
		if( sWidget ) {
			aMessage.push( 'Widget: ' + sWidget );
		}
		if( eContext ) {
			aMessage.push( 'Element: ' + this._elementToStr( eContext ) );
		}
		if( sStack ) {
			aMessage.push( 'Stack: ' + sStack );
		}
		this._send( { ...oOpts, sWidget, sMessage: aMessage.join( "\n" ) } );
	}

	/**
	 * redefine me
	 * @param {Object} oOpts
	 */
	_send( { sMessage } ) {
		console.log( sMessage );
	}

	_elementToStr( eElement, iMaxLen = 100 ) {
		let sHtml = eElement.outerHTML.substr( 0, iMaxLen ).trim();
		const iPos = sHtml.indexOf( '>' );
		if( iPos === -1 ) {
			return sHtml + '...';
		} else {
			return sHtml.substr( 0, iPos + 1 );
		}
	}
	
	_getWidgetStr( sBlockId, oWidget ) {
		let sWidget = '';
		if( sBlockId ) {
			sWidget = sBlockId;
		} else if( oWidget ) {
			sWidget = oWidget.__sId;
		}
		return sWidget;
	}
}
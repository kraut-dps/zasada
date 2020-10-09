/**
 * формирование текстовой версии ошибки
 * @implements ILogRoute
 */
export class RouteString {

	error( oError ) {
		let aMessage = [];
		aMessage.push( oError.msg() );
		const sBlockId = oError.blockId();
		const sWidgetClass = oError.widgetClass();
		aMessage.push( 'BlockId: ' + sBlockId );
		if( sWidgetClass !== sBlockId ) {
			aMessage.push( 'WidgetClass: ' + sWidgetClass );
		}
		const sContextHtml = oError.contextHtml();
		if( sContextHtml ) {
			aMessage.push( 'Context HTML: ' + sContextHtml );
		}
		aMessage.push( 'Stack: ' + oError.stackMapped() );

		const mOrigin = oError.errorOrigin();
		if( mOrigin ) {
			aMessage.push( 'OriginError: ' + mOrigin );
		}

		this._send( aMessage.join( "\n" ), oError );
	}

	/**
	 * @param {string} sMessage
	 */
	_send( sMessage ) {
		console.log( sMessage );
	}
}
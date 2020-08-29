/**
 * логирование ошибок
 * @implements ILogRoute
 */
export class RouteConsole {

	/**
	 * @param {Error} oError
	 */
	error( oError ) {

		let aMessage = [], aVars = [], oData = oError.data();

		aMessage.push( '  Error: "%s"' );
		aVars.push( oData.sMessage );

		if( oData.sHelp ) {
			aMessage.push( 'Help: %s' );
			aVars.push( oData.sHelp );
		}

		let sMessage = 'Widget: %s';
		aVars.push( oData.sBlockId );
		if( oData.oWidget ) {
			sMessage += ' %O';
			aVars.push( oData.oWidget );
		}
		aMessage.push( sMessage );

		aMessage.push( 'Element: %o' );
		aVars.push( oData.eContext );

		aMessage.push( 'StackMapped: %s' );
		aVars.push( oData.sStackMapped );

		if( oData.mOrigin ) {
			aMessage.push( 'Origin: %O' );
			aVars.push( oData.mOrigin );
		} else {
			aMessage.push( 'Stack: %s' );
			aVars.push( oData.sStack );
		}

		this._send( [ aMessage.join( "\n" ), ...aVars ], oData )
	}

	_send( aArgs ) {
		console.error( ...aArgs );
	}
}
/**
 * логирование ошибок
 * @implements ILogRoute
 */
export class RouteConsole {

	error( { sError, sStack, oWidget, sBlockId, eContext } ) {
		let aMessage = [], aVars = [];

		aMessage.push( '  Error: "%s"' );
		aVars.push( sError );

		let sMessage = ' Widget:';
		sMessage += ' %s';
		aVars.push( sBlockId );

		if( oWidget ) {
			sMessage += ' %O';
			aVars.push( oWidget );
		}

		aMessage.push( sMessage );

		aMessage.push( 'Element: %o' );
		aVars.push( eContext );

		aMessage.push( '%s' );
		aVars.push( sStack );

		this._send( [ aMessage.join( "\n" ), ...aVars ] )
	}

	_send( aArgs ) {
		console.error( ...aArgs );
	}
}
/**
 * логирование ошибок
 * @implements ILogRoute
 */
export class RouteConsole {

	log( { sError, sStack, oWidget, sBlockId, eContext } ) {
		let aMessage = [], aVars = [];
		if( sError ) {
			aMessage.push( '  Error: "%s"' );
			aVars.push( sError );
		}
		if( oWidget || sBlockId ) {
			let sMessage = ' Widget:';
			if( sBlockId ) {
				sMessage += ' %s';
				aVars.push( sBlockId );
			}
			if( oWidget ) {
				sMessage += ' %O';
				aVars.push( oWidget );
			}
			aMessage.push( sMessage );
		}
		if( eContext ) {
			aMessage.push( 'Element: %o' );
			aVars.push( eContext );
		}
		if( sStack ) {
			aMessage.push( '%s' );
			aVars.push( sStack );
		}
		this._send( [ aMessage.join( "\n" ), ...aVars ] )
	}

	_send( aArgs ) {
		console.error( ...aArgs );
	}
}
/**
 * логирование ошибок
 * @implements ILogRoute
 */
export class RouteConsole {

	error( oError ) {

		let aMessage = [], aVars = [];

		aMessage.push( '  Error: "%s"' );
		aVars.push( oError.msg() );

		const sHelp = oError.help();
		if( sHelp ) {
			aMessage.push( 'Help: %s' );
			aVars.push( sHelp );
		}

		const sBlocKId = oError.blockId();
		let sMessage = 'BlockId: %s';
		aVars.push( sBlocKId );

		const sWidgetClass = oError.widgetClass();
		if( sWidgetClass !== sBlocKId ) {
			sMessage += ' WidgetClass: %s';
			aVars.push( sWidgetClass );
		}

		const oWidget = oError.widget();
		if( oWidget ) {
			sMessage += ' %O';
			aVars.push( oWidget );
		}
		aMessage.push( sMessage );

		aMessage.push( 'Context: %o' );
		aVars.push( oError.context() );

		aMessage.push( 'StackMapped: %s' );
		aVars.push( oError.stackMapped() );

		const mOrigin = oError.errorOrigin();
		if( mOrigin ) {
			aMessage.push( 'Origin: %O' );
			aVars.push( mOrigin );
		} else {
			aMessage.push( 'Stack: %s' );
			aVars.push( oError.stackOrigin() );
		}

		this._send( [ aMessage.join( "\n" ), ...aVars ], oError );
	}

	_send( aArgs ) {
		console.error( ...aArgs );
	}
}
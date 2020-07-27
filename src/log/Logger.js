/**
 * логирование ошибок
 */
export class Logger {

	/**
	 * @type ILogRoute[]
	 */
	aRoutes = [];

	/**
	 * sourcemapped-stacktrace
	 * @type {function(): Promise<object>}
	 */
	fnAsyncOneMapStack = null;

	/**
	 * возникновение ошибки
	 */
	log( oLog ) {
		this._getStack( oLog.mError, ( sStack ) => {
			const sError = this._getErrorStr( oLog.mError );
			for( let i = 0; i < this.aRoutes.length; i++ ) {
				const oRoute = this.aRoutes[ i ];
				oRoute.log( { ...oLog, sError, sStack } );
			}
		} );
	}

	_getStack( mError, fnDone ) {

		let sStack = '';
		if( mError.stack ) {
			sStack = mError.stack;
		} else if( mError.sourceURL ) {
			sStack = mError.message + "\n@" + mError.sourceURL + ':' + mError.line + ":1";
		} else {
			fnDone( mError );
			return;
		}
		if( typeof window.Promise === 'undefined' || !this.fnAsyncOneMapStack ) {
			fnDone( sStack );
			return;
		}
		this.fnAsyncOneMapStack().then( ( oLib ) => {
			oLib.mapStackTrace( sStack, ( aMappedStack ) => {
				fnDone( aMappedStack.join( "\n" ).trim() );
			} );
		} ).catch( () => {
			fnDone( mError );
		} );
	}

	_getErrorStr( mError ) {
		return typeof mError === 'string' ? mError : mError.message;
	}
}
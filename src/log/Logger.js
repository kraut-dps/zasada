/**
 * логирование ошибок
 */
export class Logger {

	oRouteTypes;

	Error;

	oRoutes = null;

	/**
	 * sourcemapped-stacktrace
	 * @type {function(): Promise<object>}
	 */
	pMapStack = null;

	/**
	 * возникновение ошибки
	 */
	error( oLog ) {
		this._getStack( oLog.mError, ( sStack ) => {
			const sError = this._getErrorStr( oLog.mError );
			const oRoutes = this._getRoutes();
			for( let sRoute in oRoutes ) {
				const oRoute = oRoutes[ sRoute ];
				oRoute.error( { ...oLog, sError, sStack } );
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
			fnDone( sStack );
			return;
		}
		try {
			this.pMapStack().then( ( oLib ) => {
				oLib.mapStackTrace( sStack, ( aMappedStack ) => {
					fnDone( aMappedStack.join( "\n" ).trim() );
				} );
			} )
		} catch( e ) {
			fnDone( sStack );
		}
	}

	_getErrorStr( mError ) {
		if( mError instanceof this.Error ) {
			return mError.message + ' https://github.com/kraut-dps/zasada/#' + mError.name;
		} else if( typeof mError === 'string' ) {
			return mError;
		} else {
			return mError.message;
		}
	}

	_getRoutes() {
		if( this.oRoutes === null ) {
			this.oRoutes = {};
			for( let sRoute in this.oRouteTypes ) {
				const cRouteClass = this.oRouteTypes[ sRoute ];
				if( !cRouteClass ) {
					continue;
				}
				this.oRoutes[ sRoute ] = new cRouteClass();
			}
		}
		return this.oRoutes;
	}
}
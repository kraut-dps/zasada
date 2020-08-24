/**
 * логирование ошибок
 */
export class Logger {

	oRouteTypes;

	newError;

	oRoutes = null;

	/**
	 * sourcemapped-stacktrace
	 * @type {function(): Promise<object>}
	 */
	pMapStack = null;

	/**
	 * возникновение ошибки
	 */
	error( mError ) {
		const oError = this.newError( { mOrigin: mError } );
		this._getMapStack( oError.stackOrigin(), ( sStackMapped ) => {
			oError.sStackMapped = sStackMapped;
			const oRoutes = this._getRoutes();
			for( let sRoute in oRoutes ) {
				const oRoute = oRoutes[ sRoute ];
				oRoute.error( oError );
			}
		} );
	}

	_getMapStack( sStack, fnDone ) {
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
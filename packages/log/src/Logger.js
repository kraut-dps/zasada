/**
 * @typedef {import('./interfaces').ILogger} ILogger
 * @typedef {import('./interfaces').ILoggerInit} ILoggerInit
 * @typedef {import('./interfaces').ICustomError} ICustomError
 * @typedef {import('./interfaces').ILogRoute} ILogRoute
 */
/**
 * логирование ошибок
 * @type ILoggerInit
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
	 * обработка ошибки
	 */
	error( mError ) {
		const oError = this.newError( { mOrigin: mError } );
		if( oError.skipLog() ) {
			return;
		}
		this._setStackMapped( oError, () => {

			const oRoutes = this._getRoutes();
			for( let sRoute in oRoutes ) {
				const oRoute = oRoutes[ sRoute ];
				oRoute.error( oError );
			}

		} )
	}

	/**
	 * обогащение ошибки mapped stack, если это возможно
	 * без Promise, может к моменту вызова не быть еще полифила
	 * @param {ICustomError} oError
	 * @param {any} fnDone
	 */
	_setStackMapped( oError, fnDone ) {
		let sStack = oError.stackOrigin();
		if( !sStack ) {
			fnDone();
			return;
		}
		try {
			this.pMapStack().then(
				( oLib ) => {
					oLib.mapStackTrace( sStack, ( aMappedStack ) => {
						oError.setStackMapped( aMappedStack.join( "\n" ).trim() );
						fnDone();
					} );
				},
				fnDone
			)
		} catch( e ) {
			fnDone();
		}
	}

	/**
	 * @return {null|ILogRoute[]}
	 * @protected
	 */
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
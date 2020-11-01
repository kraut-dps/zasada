import {Box} from "di-box";

/** @typedef {import('./../utils/interfaces.d.ts').ILogger} ILogger */

export class LogBox extends Box{

	/**
	 * @type {ILogger}
	 */
	Logger;

	/**
	 * @type {ICustomError}
	 */
	Error;
	oRouteTypes;
	pMapStack;

	/**
	 * @type {function(): Logger}
	 */
	oneLogger() {
		return this.one( this.newLogger );
	}

	newLogger() {
		const oLogger = new this.Logger();
		oLogger.oRouteTypes = this.oRouteTypes;
		oLogger.newError = this.newError;
		oLogger.pMapStack = this.pMapStack;
		return oLogger;
	};

	newError( oProps ) {
		let oError;
		if( oProps.mOrigin && oProps.mOrigin instanceof this.Error ) {
			oError = oProps.mOrigin;
			delete oProps.mOrigin;
		} else {
			oError = new this.Error();
			/*try{
				throw new Error("1");
			} catch( e ) {
				if( e && e.stack ) {
					oError.sStack = e.stack;
				}
			}*/
		}
		Object.assign( oError, oProps );
		//for( let sKey in oProps ) {
			//if( sKey in oError ) {
				//oError[ sKey ] = oProps[ sKey ];
			//}
		//}
		return oError;
	}

	init() {
		// глобальный перехват ошибок
		window.onerror = ( message, sourceURL, line, column, oError ) => {
			try {
				if ( !oError ) {
					oError = this.newError( {mOrigin: {message, sourceURL, line, column}} );
				}
				this.oneLogger().error( oError );
			} catch( e ) {
				this.errorInOnerror( e, message, sourceURL, line, column, oError );
			}
			return true;
		};
		window.onunhandledrejection = ( oEvent ) => {
			try {
				this.oneLogger().error( oEvent.reason );
				//if( oEvent.preventDefault ) {
				//	oEvent.preventDefault();
				//}
				return false;
			} catch( e ) {
				this.errorInOnunhandledrejection( e, oEvent )
			}
		};
	}

	errorInOnerror( oError, message, sourceURL, line, column, oErrorOrigin ) {
		console.log( 'error in window.onerror: ',  oError, message, sourceURL, line, column, oErrorOrigin );
	}
	errorInOnunhandledrejection( oError, oEvent ) {
		console.log( 'error in window.onunhandledrejection: ',  oError, oEvent.reason );
	}
}
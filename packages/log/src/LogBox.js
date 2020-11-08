import {Box} from "di-box";

/**
 * @typedef {import('./interfaces').ILogger} ILogger
 * @typedef {import('./interfaces').ILoggerConstructor} ILoggerConstructor
 * @typedef {import('./interfaces').ICustomError} ICustomError
 * @typedef {import('./interfaces').ICustomErrorConstructor} ICustomErrorConstructor
 * @typedef {import('./interfaces').IRouteTypes} IRouteTypes
 */

export class LogBox extends Box{

	/**
	 * @type {ILoggerConstructor}
	 */
	Logger;

	/**
	 * @type {ICustomErrorConstructor}
	 */
	Error;

	/**
	 * @type {IRouteTypes}
	 */
	oRouteTypes;

	/**
	 * @type {function(): Promise<any>}
	 */
	pMapStack;

	_oLogger;

	/**
	 * не через .one, потому что может не быть полифила WeakMap
	 * @type {function(): ILogger}
	 */
	oneLogger() {
		if( !this._oLogger ) {
			this._oLogger = this.newLogger();
		}
		return this._oLogger;
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
		this.oneLogger().init();
	}

	reset () {
		this._oLogger = null;
		super.reset();
	}
}
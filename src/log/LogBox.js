import {Box} from "zasada/src/utils/Box.js";

export class LogBox extends Box{

	Logger;
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
		}
		for( let sKey in oProps ) {
			if( sKey in oError ) {
				oError[ sKey ] = oProps[ sKey ];
			}
		}
		return oError;
	}
}
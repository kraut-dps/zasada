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
		oLogger.Error = this.Error;
		oLogger.fnAsyncOneMapStack = this.pMapStack;
		return oLogger;
	};

	newError( sMessage, sName ) {
		const oError = new this.Error( sMessage );
		oError.name = sName;
		return oError;
	}
}
import {Box} from "zasada/src/Box.js";
import { Logger } from "zasada/src/log/Logger.js";
import { RouteConsole } from "zasada/src/log/route/RouteConsole.js";

export class LogBox extends Box{

	/**
	 * @type {function(): Logger}
	 */
	oneLogger() {
		return this.one( this.newLogger );
	}

	newLogger() {
		const oLogger = new Logger();
		oLogger.aRoutes = [
			new RouteConsole()
		];
		oLogger.fnAsyncOneMapStack = this.asyncOneMapStack;
		return oLogger;
	};

	asyncOneMapStack() {
		return import( /* webpackChunkName: "sourcemapped-stacktrace" */ 'sourcemapped-stacktrace' );
	}
}
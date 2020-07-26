import {Box} from "zasada/src/Box.es6";
import { Logger } from "zasada/src/log/Logger.es6";
import { RouteConsole } from "zasada/src/log/route/RouteConsole.es6";

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
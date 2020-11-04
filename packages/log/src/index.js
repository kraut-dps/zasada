import {LogBox} from "./LogBox.js";
import {Logger} from "./Logger.js";
import {CustomError as Error} from "./CustomError.js";
import {RouteConsole} from "./route/RouteConsole.js";

export default {
	Logger,
	Error,
	oRouteTypes: {
		console: RouteConsole,
	},
	pMapStack: () => import( /* webpackChunkName: "map-stack" */ 'sourcemapped-stacktrace' )
};
export {LogBox as _Box};
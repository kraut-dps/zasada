import {LogBox} from "./LogBox.js";
import {Logger} from "./Logger.js";
import {CustomError as Error} from "./CustomError.js";
import {RouteConsole} from "./route/RouteConsole.js";

const oBox = new LogBox();
oBox.Logger = Logger;
oBox.Error = Error;
oBox.oRouteTypes = {
	console: RouteConsole,
};
oBox.pMapStack = () => import( /* webpackChunkName: "map-stack" */ 'sourcemapped-stacktrace' );

export { oBox as default };
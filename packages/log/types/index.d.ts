/// <reference types="sourcemapped-stacktrace" />
declare namespace _default {
    export { Logger };
    export { Error };
    export namespace oRouteTypes {
        export { RouteConsole as console };
    }
    export function pMapStack(): Promise<typeof import("sourcemapped-stacktrace")>;
}
export default _default;
export { LogBox as _Box };
import { Logger } from "./Logger.js";
import { CustomError as Error } from "./CustomError.js";
import { RouteConsole } from "./route/RouteConsole.js";
import { LogBox } from "./LogBox.js";

import { LogBox } from "zasada/src/log/LogBox.js";

export class TestLogBox extends LogBox{

	asyncOneMapStack() {
		return this.importExt( '/base/node_modules/sourcemapped-stacktrace/dist/sourcemapped-stacktrace.js' )
			.then( () => { return window.sourceMappedStackTrace; } );
	}
}
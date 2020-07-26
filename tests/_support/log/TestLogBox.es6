import { LogBox } from "zasada/src/log/LogBox.es6";

export class TestLogBox extends LogBox{

	asyncOneMapStack() {
		return this.importExt( '/base/node_modules/sourcemapped-stacktrace/dist/sourcemapped-stacktrace.js' )
			.then( () => { return window.sourceMappedStackTrace; } );
	}
}
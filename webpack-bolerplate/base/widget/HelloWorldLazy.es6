import {Widget} from "zasada/src/Widget.es6";

export class HelloWorldLazy extends Widget {
	run() {
		this.bl().textContent = 'HelloWorldLazy';
	}
}
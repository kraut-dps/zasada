import {Widget} from "zasada/src/Widget.js";

export class HelloWorldLazy extends Widget {
	run() {
		this.bl().textContent = 'HelloWorldLazy';
	}
}
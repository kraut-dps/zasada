import {Widget} from "@zasada/widget";

export class SimpleWidget extends Widget {
	run() {
		this.bl().textContent = 'Hello Word!';
	}
}
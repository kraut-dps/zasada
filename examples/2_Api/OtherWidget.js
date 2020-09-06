import {Widget} from "zasada/src";

export class OtherWidget extends Widget {

	bActive = false;

	run() {
		this.bl().insertAdjacentHTML( "afterbegin", '_ _OtherWidget index = "' + this.index() + '"' );
	}

	_getIndex() {
		return this._attr( '', 'index' );
	}

	toggle() {
		this.bActive = !this.bActive;
		this._mod( '', 'active', this.bActive );
	}
}
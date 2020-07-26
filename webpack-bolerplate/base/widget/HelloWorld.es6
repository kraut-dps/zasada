import {Widget} from "zasada/src/Widget.es6";

export class HelloWorld extends Widget {

	sModClass;

	run() {
		// устанавливаем текст "Hello World" элементу с классом "_HelloWorld-Text"
		this._el( 'Text' ).textContent = 'Hello World!';

		// добавляем html class this.sModClass основному блоку виджета
		this._mod( '', this.sModClass, true );
	}
}
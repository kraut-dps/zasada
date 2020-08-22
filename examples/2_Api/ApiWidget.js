import {Widget} from "zasada/src/index.js";
import {TestWidget} from "./TestWidget.js";
import {OtherWidget} from "./OtherWidget.js";

export class ApiWidget extends Widget {

	run() {

		const oCode = {
			BlockElement: [
				function () {
					// клик по такой кнопке выполняет этот код в контексте виджета TestWidget =>
					// .blockId() возвращает строку с названием блока
					alert( this.blockId() );
				},
				function () {
					// .bl() возвращает DOM Element блок к которому привязан виджет
					this.bl().style.borderWidth = '5px';
				},
				function () {
					// ._el() вощвращает DOM Element с элементом виджета
					this._el( 'Element' ).style.borderWidth = '5px';
				},
				function () {
					// ._el() с аргументом "" возвращает блок
					console.log( this._el( "" ) === this.bl() );
				},
				function () {
					// добавление "[]" возвращает массив элементов
					this._el( "OtherElement[]" ).forEach( ( eElement ) => {
						eElement.style.borderWidth = '5px';
					} )
				},
				function () {
					// если элемента c запрошенным именем нет, будет ошибка
					console.log( this._el( "NoElement" ) );
				},
				function () {
					// но если добавить "?" то ошибки не будет
					console.log( this._el( "NoElement?" ) );
				},
			],
			Attr: [
				function () {
					// у большинства методов, первым аргументом идет контекст ( "" - блок или "[имя элемента]" - элемент )
					// данные HTML атрибута data-var1 блока
					console.log( this._attr( '', 'var1' ) );
					console.log( this.bl() );
				},
				function () {
					// --//-- с преобразованием к типу int
					console.log( this._attr( '', 'i:var1' ) );
				},
				function () {
					// --//-- с преобразованием к типу bool
					console.log( this._attr( '', 'b:var1' ) );
				},
				function () {
					// данные HTML атрибутов элемента "Element"
					console.log( this._attrs( "Element", {var1: 'i:v1', var2: 'js:v2', var3: 'mod:v3'} ) );
					console.log( this._el( "Element" ) );
				},
				function () {
					// данные HTML атрибута с кастомным префиксом "my-" вместо "data-" элемента "Element"
					console.log( this._attr( "Element", "var1", "my-" ) );
					console.log( this._el( "Element" ) );
				},
				function () {
					// поместить данные HTML атрибута data-var1 основного блока в свойство виджета fWidgetVar, преобразовать в float
					this._my( {var1: 'f:fWidgetVar'} );
					console.log( this.fWidgetVar );
					console.log( this.bl() );
				},
			],
			Mod: [
				function () {
					// добавить css класс блоку
					this._mod( '', 'active', true );
				},
				function () {
					// добавить css класс блоку, убрать другие конфликтующие
					this._mod( '', [ 'active', 'active2', 'active3' ], 'active2' );
				},
				function () {
					// добавить css класс блоку, убрать другие конфликтующие, по алиасам
					this._mod( '', {one:"active",two:"active2",three:"active3"}, "three" );
				},
			],
			Rel: [
				function () {
					// доступ к предку по типу
					const oOtherWidget = this.rel()
						.parents()
						.typeOf( OtherWidget )
						.find();
					oOtherWidget.toggle();
				},
				function () {
					// доступ к потомку по типу
					const oOtherWidget = this.rel()
						.children()
						.typeOf( OtherWidget )
						.find();
					oOtherWidget.toggle();
				},
				function () {
					// доступ по индексу
					const oOtherWidget = this.rel()
						.index( 'sibling' )
						.find();
					oOtherWidget.toggle();
				},
				function () {
					// доступ к нескольким виджетам
					this.rel()
						.typeOf( OtherWidget )
						.onlyFirst( false )
						.find()
						.forEach( ( oOtherWidget ) => {
							oOtherWidget.toggle();
						} );
				},
			],
			Event: [
				function () {
					// кастомный обработчик событий установим, создадим событие, уберем
					const fnHandler = function ( oEvent ) {
						console.log( oEvent.detail );
					};
					this._on( '', 'customEvent', fnHandler );
					this._fire( '', 'customEvent', {eventVar: '123'} );
					this._off( '', 'customEvent', fnHandler );
				},
			],
		};

		for( let sName in oCode ) {
			oCode[ sName ].forEach( ( fn ) => {
				const eBtn = document.createElement( 'button' );
				eBtn.className = 'btn';
				eBtn.innerHTML = this._fnBody( fn );
				this._el( sName ).appendChild( eBtn );
				this._on( eBtn, 'click', () => {
					const oTestWidget = this.rel().typeOf( TestWidget ).find();
					fn.call( oTestWidget );
				} );
			} );
		}
	}

	_fnBody( fn ) {
		const sFullCode = fn.toString();
		// https://stackoverflow.com/questions/3179861/javascript-get-function-body
		const sFnStart = '{';
		let sBody = sFullCode.substring( sFullCode.indexOf( sFnStart ) + sFnStart.length, sFullCode.lastIndexOf("}") );
		sBody = sBody.trim();
		sBody = sBody.replace( /_this(\d)?\./g, 'this.' );
		sBody = sBody.replace( /\n+/g, "\n" );
		sBody = sBody.replace( /\n/g, "<br/>" );
		// чтобы покрасивше выводилось название виджета, а не webpack закорючки
		sBody = sBody.replace( /\([^\(]+OtherWidget[^\)]+\)/, "(OtherWidget)" );
		return sBody;
	}
}
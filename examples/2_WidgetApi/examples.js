window.oExamples = {
	BlockElement: {
		sTitle: "Widget.blockId(), Widget.bl(), Widget._el() доступ к блоку, элементу",
		sHtml:
`<div class="block _ _TestWidget">
	<div class="block__element _TestWidget-Element"></div>
	<div class="block__element _TestWidget-OtherElement"></div>
	<div class="block__element _TestWidget-OtherElement"></div>
</div>`,
		aExamples: [
function () {
	// клик по такой кнопке выполняет этот код в контексте виджета TestWidget
	// .blockId() возвращает строку с названием блока
	alert( this.blockId() );

},
function () {
	// .bl() возвращает DOM Element блок к которому привязан виджет
	this.bl().style.borderWidth = '6px';

},
function () {
	// ._el() вощвращает DOM Element с элементом виджета
	this._el( 'Element' ).style.borderWidth = '6px';

},
function () {
	// ._el() с аргументом "" возвращает блок, см. консоль
	console.log( this._el( "" ) === this.bl() );

},
function () {
	// добавление "[]" возвращает массив элементов
	this._el( "OtherElement[]" ).forEach( ( eElement ) => {
		eElement.style.borderWidth = '6px';
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
	},
	Attr: {
		sTitle: "Widget._attr(), Widget._attrs(), Widget._my() доступ к атрибутам блока и элементов",
		sHtml:
`<div class="block _ _TestWidget" data-var1="3.14">
	<div class="block__element _TestWidget-Element" data-var1="0" data-var2='{"json1":4}' data-var3="sub1=1,sub2=2" my-var1="10"></div>
</div>`,
		aExamples: [
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

}
		]
	},
	Mod: {
		sTitle: "Widget._mod() модификация html class атрибута",
		sHtml: `<div class="block _ _TestWidget"></div>`,
		aExamples: [
function () {
	// добавить css класс "active" блоку
	this._mod( '', 'active', true );

},
function () {
	// добавить css класс "active2" блоку, убрать другие конфликтующие "active", "active3"
	this._mod( '', ['active', 'active2', 'active3'], 'active2' );

},
function () {
	// добавить css класс блоку "active3", убрать другие конфликтующие, по алиасам "active", "active2"
	this._mod( '', {one: "active", two: "active2", three: "active3"}, "three" );

},
		],
	},
	Html: {
		sTitle: "Widget._html() замена / вставка html кода, обертка над Element.innerHTML и Element.insertAdjacentHTML()",
		sHtml:
`<div class="block _ _TestWidget">
	<div class="block__element _TestWidget-Element"></div>
</div>`,
		aExamples: [
function () {
	// замена html внутри Element ( innerHTML )
	this._html( 'Element', '<div class="block _ _InsertWidget" data-index="Element innerHTML"></div>' );

},
function () {
	// вставка html beforebegin ( insertAdjacentHTML )
	this._html( '', '<div class="block _ _InsertWidget" data-index="beforebegin"></div>', 'beforebegin' );

},
function () {
	// вставка html afterbegin ( insertAdjacentHTML )
	this._html( '', '<div class="block _ _InsertWidget" data-index="afterbegin"></div>', 'afterbegin' );

},
function () {
	// вставка html beforeend ( insertAdjacentHTML )
	this._html( '', '<div class="block _ _InsertWidget" data-index="beforeend"></div>', 'beforeend' );

},
function () {
	// вставка html afterend ( insertAdjacentHTML )
	this._html( '', '<div class="block _ _InsertWidget" data-index="afterend"></div>', 'afterend' );

},
		]
	},
	Rel: {
		sTitle: "Widget.rel() доступ к другим виджетам",
		sHtml:
`<div class="block block_oth _ _OtherWidget" data-index="parent">
	<div class="block _ _TestWidget">
		<div class="block block_oth _ _OtherWidget" data-index="child"></div>
	</div>
	<div class="block block_oth _ _OtherWidget" data-index="sibling">
</div>`,
		aExamples: [
function ( OtherWidget ) {
	// доступ к предку по типу .parents()
	const oOtherWidget = this.rel()
		.parents()
		.typeOf( OtherWidget )
		.find();
	oOtherWidget.toggle();

},
function ( OtherWidget ) {
	// доступ к потомку по типу .children()
	const oOtherWidget = this.rel()
		.children()
		.typeOf( OtherWidget )
		.find();
	oOtherWidget.toggle();

},
function ( OtherWidget ) {
	// доступ по индексу .index()
	const oOtherWidget = this.rel()
		.index( 'sibling' )
		.find();
	oOtherWidget.toggle();

},
function ( OtherWidget ) {
	// доступ к нескольким виджетам .find( bAll = true )
	this.rel()
		.typeOf( OtherWidget )
		.find( true )
		.forEach( ( oOtherWidget ) => {
			oOtherWidget.toggle();
		} );

},
		]
	},
	Event: {
		sTitle: "Widget._on(), Widget._off(), Widget._fire() обработка DOM событий",
		sHtml: `<div class="block _ _TestWidget"></div>`,
		aExamples: [
function () {
	// кастомный обработчик событий установим, создадим событие, уберем
	const fnHandler = function ( oEvent ) {
		console.log( oEvent.detail );
	};
	this._on( '', 'customEvent', fnHandler );
	this._fire( '', 'customEvent', {eventVar: '123'} );
	this._off( '', 'customEvent', fnHandler );

},
		]
	},
};
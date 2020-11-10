# Zasada

Фабрика виджетов, для упрощения WEB разработки, с рендерингом HTML на сервере.

## Определения
 * _Виджет_ - ecmascript class с методом run ( запускается при привязке виджета к DOM узлу ).
 * _Блок_ - DOM узел, к которому привязан _виджет_.
 * _Элемент_ - DOM узел потомок _блока_.
 Смысл определений _блок_ и _элемент_ из [БЭМ методологии](https://ru.bem.info/methodology/quick-start/).
## Разметка 
```html
<div class="_ _Widget"> // блок, к которому првязан виджет "Widget"
    <span class="_Widget-Element1"></span> // элемент виджета Widget, с названием "Element1"
    <span class="_Widget-Element2"></span> // элемент виджета Widget, с названием "Element2"
</div>
// "_" - специальный класс, чтобы в один запрос к DOM найти все узлы с виджетами
```
```javascript
// виджет
class Widget {
    run() {}
}
```

## Особенности
 * Больше подходит для рендеринга HTML на сервере.
 * Легко переносить _виджеты_ из проекта в проект, достаточно перенести esmodule класс, и добавить HTML class верстку.
 * Минимум обращений к DOM, один запрос document.querySelectorAll( '_' ) для всех _виджетов_ на странице.
 * Кеширование _элементов_ внутри контекста _виджета_, к DOM обращение только один раз.
 * Легкое обращение из одного _виджета_ к другому через специальный интерфейс ._rel или через события.
 * Dependency injection реализация, позволяющая гибко изменить - расширить функционал.
 * Возможность вложенности _виджетов_, например когда _элемент_ одного _виджета_ является _блоком_ другого
```html
<div class="_ _Widget1 _Widget2">
    <span class="_ _Widget3 _Widget1-Element _Widget2-Element">
        <span class="_Widget1-Element _Widget3-Element"></span>
    </span>
</div>
```
 * Легкая возможность подгрузки по требованию кода _виджетов_ с сервера ( Lazy ).
 * Расширяемая система логирования ошибок
 * Легкая навигация по коду в PhpStorm, Chrome, FireFox...
 * Простая возможность передавать с сервера необходимые дополнительные действия на странице. Например после ajax запроса, просто добавляя дополнительные css классы в HTML ответ. Например, закрыть popup.
 * Интерфейсы из коробки для доступа к данным в атрибутах _блоков_ и _элементов_ ._attr, ._attrs, ._my
 * Интерфейсы из коробки для работы с событиями ._on, ._off, ._fire
 * Средний размер 38 kb ( 10 kb gz )

## Примеры
[Codesandbox](https://codesandbox.io/s/github/kraut-dps/zasada/tree/%40zasada/examples%400.0.5/packages/examples/?file=/src/1_HelloWorld/index.js)

## API Reference
Пока отдельного описания нет, но есть в [примерах](https://codesandbox.io/s/github/kraut-dps/zasada/tree/%40zasada/examples%400.0.5/packages/examples/?file=/src/1_HelloWorld/index.js) - нужно в окне browser кликнуть по WidgetApi или LinkerApi

## Концепция
 * По аналогии с DOM, CSSOM еще одна Object Model, где узлами являются DOM элементы с привязанным js функционалом.
 * На определяющие привязку виджетов class значения не добавляются css свойства, для отделния функционала, и отображения.
 * Один виджет не обращается к элментам другого виджета. В другом виджете раеализованы публичные методы для реализации необходимого.
 * Дополнительная декларативность через HTML. Например, виджет слайдер картинок, кнопки предыдущая-следующая. Вместо того, чтобы через js создавать новые узлы DOM, в зависимости от параметров, виджет при наличии в HTML элементов кнопок отслеживает клики по ним, а при отсутствии ничего не делает.

## Ошибки

### Not found BlockId
DOM узел обозначен как связанный с _виджетом_, но не обозначен с каким.
```html
<div class="_ _MyWidget">ok</div>
<div class="_">error</div>
<div class="_ MyWidget">error</div>
```

### No widget class
Есть разметка в HTML, но нет определения в Linker
```html
<div class="_ _MyWidget"></div>
```
```javascript
// ...
oLinker.setWidgets( { MyWidget } ); // not executed
// ...
```

### No widget prop
Попытка присвоить значение несуществующему свойству класса виджета.
```javascript
// ...
class MyWidget extends Widget {
    definedVar;
}
// ...
oLinker.setOpts( {
    Widget: {
        oProps: {
            definedVar: 'value', // ok
            undefinedVar: 'value' // error
        }    
    }
} );
// ...
```

### Element not found
Не найден _элемент_. Если отсутствие элемента штатная ситуация - нужно добавить "?".
```html
<div class="_ _MyWidget">
    <div class="_MyWidget-Element">
</div>
```
```javascript
class MyWidget extends Widget {
    run() {
        this._el( 'Element' ); // DOM Element ok 
        this._el( 'NotFoundElement' ); // error
        this._el( 'NotFoundElement?' ); // null ok
    }
}
```

### Element query parse
Неправильный запрос элемента
```html
<div class="_ _MyWidget">
    <div class="_MyWidget-Element">
</div>
```
```javascript
class MyWidget extends Widget {
    run() {
        this._el( 'Element' ); // DOM Element ok 
        this._el( 'Element[]' ); // [Dom Element] ok
        this._el( 'NotExistElement?' ); // null ok
        this._el( 'Element]' ); // error
    }
}
```

### Rel not found
Не найден виджет. Если отсутствие виджета штатная ситуация, нужно добавить вызов canEmpty( true ).
```html
<div class="_ _MyWidget"></div>
<div class="_ _OtherWidget"></div>
```
```javascript
class MyWidget extends Widget {
    run() {
        this._rel().typeOf( OtherWidget ).find(); // object OtherWidget ok 
        this._rel().children().typeOf( OtherWidget ).find(); // error
        this._rel().children().typeOf( OtherWidget ).canEmpty().find(); // null ok
    }
}
```

### Unknown attr cast
Не найдено определение преобразования типа данных.
```html
<div class="_ _MyWidget" data-var="3.14"></div>
```
```javascript
class MyWidget extends Widget {
    iVar;
    fVar;
    run() {
        this._my( { var: 'i:iVar' } ); // this.iVar = 3; ok 
        this._my( { var: 'f:iVar' } ); // this.fVar = 3.14; ok
        this._my( { var: 'undefCast:iVar' } ); // error
    }
}
```
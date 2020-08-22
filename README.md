# zasada

## Определения
 * _Виджет_ - ecmascript class с методом run ( запускается при привязке виджета к DOM узлу ).
 * _Блок_ - DOM узел, к которому привязан _виджет_.
 * _Элемент_ - DOM узел потомок _блока_.
```html
<div class="_ _Widget"> // блок
    <span class="_Widget-Element1"></span> // элемент
    <span class="_Widget-Element2"></span> // элемент
</div>
```
```javascript
// виджет
class Widget {
    run() {}
}
```

## Особенности
 * Для приложений с рендерингом html на сервере 
 * Легко переносить _виджеты_ из проекта в проект, достаточно перенести класс, и добавить html верстку.
 * Минимум обращений к DOM, один запрос document.querySelectorAll( '_' ) для всех _виджетов_ на странице.
 * Кеширование _элементов_ внутри контекста _виджета_, к DOM обращение только один раз.
 * Легкое обращение из одного _виджета_ к другому через специальный интерфейс .rel или через события.
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
 * Интерфейсы из коробки для доступа к данным в атрибутах _блоков_ и _элементов_ ._attr, ._attrs, ._my
 * Интерфейсы из коробки для работы с событиями ._on, ._off, ._fire

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
        this.rel().typeOf( OtherWidget ).find(); // object OtherWidget ok 
        this.rel().children().typeOf( OtherWidget ).find(); // error
        this.rel().children().typeOf( OtherWidget ).canEmpty().find(); // null ok
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
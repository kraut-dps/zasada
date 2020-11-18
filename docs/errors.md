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
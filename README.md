# zasada

# Ошибки

## Not found BlockId
DOM элемент обозначен как связанный с виджетами, но не обозначен с какими.
```html
<div class="_ _MyWidget">ok</div>
<div class="_">error</div>
<div class="_ MyWidget">error</div>
```

## No widget class
Есть разметка в HTML, но нет определения в Linker
```html
<div class="_ _MyWidget"></div>
```
```javascript
// ...
oLinker.setWidgets( { MyWidget } ); // not executed
// ...
```

## No widget prop
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

## Element not found
Не найден элемент. Если отсутствие элемента штатная ситуация - нужно добавить "?".
```html
<div class="_ _MyWidget">
    <div class="_MyWidget-Element">
</div>
```
```javascript
// ...
class MyWidget extends Widget {
    run() {
        this._el( 'Element' ); // DOM Element ok 
        this._el( 'NotFoundElement' ); // error
        this._el( 'NotFoundElement?' ); // null ok
    }
}
// ...
```

## Rel not found
Не найден зависящий виджет. Если отсутствие виджета штатная ситуация, нужно добавить вызов canEmpty( true ).
```html
<div class="_ _MyWidget"></div>
<div class="_ _OtherWidget"></div>
```
```javascript
// ...
class MyWidget extends Widget {
    run() {
        this.rel().typeOf( OtherWidget ).find(); // object OtherWidget ok 
        this.rel().children().typeOf( OtherWidget ).find(); // error
        this.rel().children().typeOf( OtherWidget ).canEmpty().find(); // null ok
    }
}
// ...
```
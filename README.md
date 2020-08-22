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

## No Widget Prop
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
//...
```

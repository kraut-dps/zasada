import oRoot from "@zasada/bootstrap";
import {SimpleWidget} from "./SimpleWidget.js";

// тут специально callback, init метод загрузит с сервера полифил Promise, если необходимо
oRoot.core.init( ( oLinker ) => {

	// регистрация виджета
	oLinker.setWidgets( { SimpleWidget } );

	// привязка виджетов ко всему документу
	oLinker.link( document );
} );
window.oExamples = {
	propsExample: {
		sTitle: "Установка свойств виджетов",
		sHtml: '<div class="block _ _WidgetWithProps"></div>',
		aExamples: [
			function( oLinker, Widget ) {

				// можно установить свойства виджета

				// тестовый виджет, при запуске выводит свои свойства в блок
				class WidgetWithProps extends Widget {
					sProp1;
					fProp2;
					run() {
						this.bl().textContent = 'sProp1 = "' + this.sProp1 + '"; fProp2 = ' + this.fProp2;
					}
				}

				oLinker.setWidgets( { WidgetWithProps } );

				// возможность установить свойства через Linker
				oLinker.setOpts( {
					WidgetWithProps: {
						oProps: {
							sProp1: 'test string',
							fProp2: 3.14
						}
					}
				} );

			}
		]
	},
	skipRunExample: {
		sTitle: "Отключение выполннения метода .run() у виджета",
		sHtml: '<div class="block _ _WidgetSkipRun"></div><div class="block _ _WidgetRunner"></div>',
		aExamples: [
			function( oLinker, Widget ) {

				// можно не выполнять .run() виджета

				// тестовый виджет, при запуске выделяется
				class WidgetSkipRun extends Widget {
					run() {
						this.bl().style.borderWidth = '6px';
					}
				}
				// отдельный виджет, который запустит WidgetSkipRun
				class WidgetRunner extends Widget {
					run() {
						this._rel().typeOf( WidgetSkipRun ).find().run();
					}
				}

				oLinker.setWidgets( { WidgetSkipRun, WidgetRunner } );

				// тут как раз и указываем у какого виджета не делать run()
				oLinker.setOpts( {
					WidgetSkipRun: {
						bSkipRun: true
					}
				} );

			}
		]
	},
	importExample: {
		sTitle: ".setImports() установка методов импорта внешних ресурсов",
		sHtml: '<div class="block _ _WidgetImport1"></div><div class="block _ _WidgetImport2"></div><div class="block _ _WidgetImport3"></div>',
		aExamples: [
			function( oLinker, Widget, importExt ) {

				// можно использовать глобальное хранилище динамических импортов

				// тестовый виджет, при запуске загружает jquery из import и выводит версию
				class WidgetImport extends Widget {
					async run() {
						await this._import( 'jquery' );
						this.bl().textContent = jQuery.fn.jquery;
					}
				}
				class WidgetImport3 extends Widget {
					async run() {
						await this._import( 'jquery-3.5.1' );
						this.bl().textContent = jQuery.fn.jquery;
					}
				}

				// регистрируем виджеты, WidgetImport1 и WidgetImport2 это один и тот же класс,
				// WidgetImport3 другой
				oLinker.setWidgets( {
					WidgetImport1: WidgetImport,
					WidgetImport2: WidgetImport,
					WidgetImport3
				} );

				// непосредственно задание импортов
				oLinker.setImports( {
					'jquery-1.12.4': () => importExt( "https://code.jquery.com/jquery-1.12.4.min.js" ),
					'jquery-2.2.4': () => importExt( "https://code.jquery.com/jquery-2.2.4.min.js" ),
					'jquery-3.5.1': () => importExt( "https://code.jquery.com/jquery-3.5.1.min.js" ),
				} );

				// возможность установить алиас для import для виджета
				oLinker.setOpts( {
					WidgetImport1: {
						oImports: {
							jquery: 'jquery-1.12.4'
						}
					},
					WidgetImport2: {
						oImports: {
							jquery: 'jquery-2.2.4'
						}
					}
				} );
			}
		]
	},
	lazyExample: {
		sTitle: '.setBeforeNew() загрузка кода виджетов "по запросу" lazy',
		sHtml: '<div class="block _ _LazyExample"></div>',
		aExamples: [
			function( oLinker, Widget ) {

				// можно динамически подгружать с сервера виджеты

				class LazyExample extends Widget {
					run() {
						this._html( '', `<div class="block _ _LazyWidget1"></div>
							<div class="block _ _LazyWidget2"></div>`
						);
					}
				}

				oLinker.setWidgets( { LazyExample } );

				// первым аргументом blockId виджетов, которые
				// хотим по запросу подгрузить
				// вторым аргументом функция, которая вернет Promise,
				// а внутри вызовет oLinker.setWidgets c запрошенными классами виджетов
				oLinker.setBeforeNew( [ 'LazyWidget1', 'LazyWidget2' ], () => {

					// // пока не придумал как это сделать в примерах,
					// // но в webpack будет все работать
					// return import( /* webpackChunkName: "lazy-widgets" */ "url.js" )
					// 	.then( ( { LazyWidget1, LazyWidget2 } ) => {
					//  		oLinker.setWidgets( { LazyWidget1, LazyWidget2 } );
					// 	} );
					// // "url.js" это на сервере файл примерно такого содержания
					// import {LazyWidget1} from "LazyWidget1.js";
					// import {LazyWidget2} from "LazyWidget2.js";
					// export { LazyWidget1, LazyWidget2 };

					// пока заглушка более простая
					class LazyWidget extends Widget {
						run() {
							this.bl().textContent = "I'm LazyWidget";
						}
					}
					oLinker.setWidgets( { LazyWidget1: LazyWidget, LazyWidget2: LazyWidget } );
				} );
			}
		]
	}
};
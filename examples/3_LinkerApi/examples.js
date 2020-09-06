window.oExamples = {
	propsExample: function( oLinker, Widget ) {
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
	},
	skipRunExample: function( oLinker, Widget ) {
		// тестовый виджет, при запуске вызывает alert
		class WidgetSkipRun extends Widget {
			run() {
				alert(1);
			}
		}
		class WidgetRunner extends Widget {
			run() {
				this._on( '', 'click', () => {
					this.rel().typeOf( WidgetSkipRun ).find().run();
				} )
			}
		}

		oLinker.setWidgets( { WidgetSkipRun, WidgetRunner } );

		oLinker.setOpts( {
			WidgetSkipRun: {
				bSkipRun: true
			}
		} );
	}
};
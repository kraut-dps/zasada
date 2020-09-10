window.oExamples = {
	customMarkupExample: {
		sTitle: "Кастомная разметка виджетов, подмена класса Dom",
		sHtml: `<div class="block" b="Block">
	<div class="block__element" e="Block-Element"></div>
		</div>`,
		aExamples: [
			function( RootBox, oDeps, Widget, eContext ) {

				// допустим хотим сделать кастомную разметку виджетов
				// хотим в атрибуте "b" чтобы указывалось название виджета
				// а в атрибуте "e" чтобы указывалось название элемента

				class CustomDom extends oDeps.core.Dom {
					// подменяем метод, который формирует css селектор для поиска виджетов
					sel( sBlockId = '', sElementId = '' ) {
						if( sBlockId ) {
							if( sElementId ) {
								return '[e="' + sBlockId + '-' + sElementId + '"]';
							} else {
								return '[b="' + sBlockId + '"]';
							}
						} else {
							return '[b]';
						}
					}

					// подменяем метод разбора идентификаторов блоков
					parseBlockIds( eContext ) {
						let aRet = [];
						const sB = eContext.getAttribute( 'b' );
						if( !sB ) {
							return aRet;
						}
						return [ sB ];
					}
				}

				class Block extends Widget {
					run() {
						// виджет просто добавляет в блок "block", в элемент "element"
						this.bl().insertAdjacentHTML( 'afterbegin', 'block' );
						this._el( 'Element' ).insertAdjacentHTML( 'afterbegin', 'element' );
					}
				}

				oDeps.core.Dom = CustomDom;
				const oRootBox = new RootBox( oDeps );

				oRootBox.box( 'core' ).init( ( oLinker ) => {
					oLinker.setWidgets( { Block } );
					oLinker.link( eContext );
				} );
			}
		]
	},

	customErrorRouteExample: {
		sTitle: "Кастомный вывод ошибок",
		sHtml: `<div class="block _ _ErrorWidget"></div>`,
		aExamples: [
			function( RootBox, oDeps, Widget, eContext, RouteString ) {

				// допустим хотим сделать чтобы ошибки через alert выводились

				class CustomErrorRoute extends RouteString {
					_send( sMessage ) {
						alert( sMessage );
					}
				}

				class ErrorWidget extends Widget {
					run() {
						throw new Error( 'error' );
					}
				}

				oDeps.log.oRouteTypes = [ CustomErrorRoute ];
				const oRootBox = new RootBox( oDeps );

				oRootBox.box( 'core' ).init( ( oLinker ) => {
					oLinker.setWidgets( { ErrorWidget } );
					oLinker.link( eContext );
				} );
			}
		]
	},
};
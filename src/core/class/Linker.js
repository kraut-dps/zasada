/**
 * основной класс связывающий {Element} с виджетами
 * @implements ILinker
 */
export class Linker {

	/**
	 * @type {function(Element, string, function() ): IWidget}
	 */
	newWidget;

	newError;

	newRelQuery;

	/**
	 * @type {function(): IStorage}
	 */
	oneStorage;

	/**
	 * @type {function(): IDom}
	 */
	oneDom;

	/**
	 * @type {function( oTarget: object|*, oSource: object|* ): void }
	 */
	fnMergeDeep;

	/**
	 * @type {function( mKeys: object|array, aSources: ...object ): void }
	 */
	fnDeepKey;

	fnAssertUndefProps;

	_oOpts = {};

	_oImports = {};

	/**
	 * установка опций виджетов
	 * @param {ILinkerOpts} oOpts
	 */
	setOpts( oOpts ) {
		for ( let sBlockId in oOpts ) {
			if ( !this._oOpts[ sBlockId ] ) {
				this._oOpts[ sBlockId ] = { sBlockId };
			}
			this.fnMergeDeep( this._oOpts[ sBlockId ], oOpts[ sBlockId ] );
		}
	}

	/**
	 * установка классов виджетов
	 * @param {ILinkerClasses} oClasses
	 */
	setWidgets( oClasses ) {
		for ( let sBlockId in oClasses ) {
			this._oOpts[ sBlockId ] = { sBlockId, ...this._oOpts[ sBlockId ], cWidget: oClasses[ sBlockId ] };
		}
	}

	/**
	 * установка callback методов перед созданием виджетов
	 * пример использования, подзагрузка с сервера виджетов по названию
	 * @param {array} aBlockIds
	 * @param {function} fnBeforeNew
	 */
	setBeforeNew( aBlockIds, fnBeforeNew ) {
		for ( let j = 0; j < aBlockIds.length; j++ ) {
			const sBlockId = aBlockIds[ j ];
			this._oOpts[ sBlockId ] = { sBlockId, ...this._oOpts[ sBlockId ], fnBeforeNew };
		}
	}

	setImports( oDynamicImports ) {
		this._oImports = { ...this._oImports, ...oDynamicImports };
	}

	getImport( sImportName, sBlockId ) {
		const oImportAliases =  this._oOpts[ sBlockId ][ 'oImports' ] || {};
		if( oImportAliases[ sImportName ] ) {
			sImportName = oImportAliases[ sImportName ];
		}
		return this._oImports[ sImportName ];
	}

	/**
	 * связывание Element
	 * @param {Element} eContext
	 * @param {boolean} bWithSelf
	 * @return {Promise<any[]>}
	 */
	link( eContext, bWithSelf = false ) {
		let aModelContexts, eModelContext, sBlockId, aBlockIds, i, aPromises = [];
		const oDom = this.oneDom();

		aModelContexts = oDom.children( eContext, oDom.sel(), bWithSelf, false );
		for ( i = 0; i < aModelContexts.length; i++ ) {
			eModelContext = aModelContexts[ i ];
			sBlockId = '';
			try {
				aBlockIds = oDom.parseBlockIds( eModelContext );
				if ( !aBlockIds.length ) {
					throw this.newError( {
						message: 'Not found _blockId in tag class',
						sHelp: 'not-found-blockid',
						eContext: eModelContext,
						sBlockId
					} );
				}
				for ( let j = 0; j < aBlockIds.length; j++ ) {
					try {
						sBlockId = aBlockIds[ j ];
						if ( !this._oOpts[ sBlockId ] ) {
							throw this.newError( {
								message: 'No widget "' + sBlockId + '" opts',
								sHelp: 'no-widget-opts',
								eContext: eModelContext,
								sBlockId
							} );
						}
						aPromises.push( this.widget( eModelContext, sBlockId ) );
					} catch ( oError ) {
						aPromises.push( Promise.reject( oError ) );
					}
				}
			} catch ( oError ) {
				aPromises.push( Promise.reject( oError ) );
			}
		}
		return Promise.all( aPromises );
	}

	unlink( eContext, bWithSelf ) {
		const oStorage = this.oneStorage();
		let aWidgets = oStorage.drop( eContext, bWithSelf ), i, oWidget;
		for ( i = 0; i < aWidgets.length; i++ ) {
			oWidget = aWidgets[ i ];
			oWidget.destructor();
		}
	}

	widget( eContext, sBlockId, oCustomOpts = null ) {
		oCustomOpts = { ...(oCustomOpts || {} ), ...this._oOpts[ sBlockId ] };
		const { fnBeforeNew } = oCustomOpts;
		let oNewWidget;
		return Promise
			.resolve(
				fnBeforeNew ? fnBeforeNew( oCustomOpts ) : null
			)
			.then( () => {
				oCustomOpts = { ...oCustomOpts, ...this._oOpts[ sBlockId ] };
				const { cWidget, oProps, fnAfterNew } = this.fnDeepKey( [ 'cWidget', 'oProps', 'fnAfterNew' ], oCustomOpts );
				if ( !cWidget ) {
					throw this.newError( {
						message: 'Not set widget class "' + sBlockId + '"',
						sHelp: 'no-widget-class'
					} );
				}
				oNewWidget = this.newWidget( eContext, sBlockId, cWidget );
				this._setProps( oNewWidget, oProps );
				return fnAfterNew ? fnAfterNew( oNewWidget, oCustomOpts ) : null;
			} )
			//.then( () => {
			//	this.fnAssertUndefProps( oNewWidget );
			//	this.oneStorage().add( oNewWidget );
				//return oNewWidget.init();
			//} )
			.then( () => {
				this.fnAssertUndefProps( oNewWidget );
				this.oneStorage().add( oNewWidget );
				const { fnBeforeRun } = this.fnDeepKey( ['fnBeforeRun'], oCustomOpts, this._oOpts[ sBlockId ] );
				return fnBeforeRun ? fnBeforeRun( oNewWidget, oCustomOpts ) : null;
			} )
			.then( () => {
				const { bSkipRun } = this.fnDeepKey( ['bSkipRun'], oCustomOpts, this._oOpts[ sBlockId ] );
				if( !bSkipRun ) {
					return Promise.resolve( oNewWidget.run() ).then( () => {
						return oNewWidget;
					} );
				}
				return oNewWidget;
			} )
			.catch( ( mError ) => {
				const oData = {
					mOrigin: mError,
					sBlockId,
					eContext
				};
				if( oNewWidget ) {
					oData.oWidget = oNewWidget;
				}
				throw this.newError( oData );
			} );
	}

	_setProps( oWidget, oProps ) {
		if( !oProps ) {
			return;
		}
		for ( let sPropName in oProps ) {
			if ( !( sPropName in oWidget ) ) {
				throw this.newError( {
					message: 'No widget property "' + oWidget.blockId() + '.' + sPropName + '"',
					sHelp: 'no-widget-prop'
				} );
			}
			oWidget[ sPropName ] = oProps[ sPropName ];
		}
	}
}
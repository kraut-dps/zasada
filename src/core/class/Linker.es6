/**
 * основной класс связывающий {Element} с виджетами
 * @implements ILinker
 */
export class Linker {

	/**
	 * @type {function(Element, string, function() ): IWidget}
	 */
	newWidget;

	/**
	 * @type {function(): IStorage}
	 */
	oneStorage;

	/**
	 * @type {function(): IDom}
	 */
	oneDom;

	/**
	 * @type {function(): ILogger}
	 */
	oneLogger;

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
	 * @param {object} oOpts
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
	 * @param {object} oClasses
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

	getImport( sImportName, sBlockId = '' ) {
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

		aModelContexts = oDom.children( eContext, oDom.sel(), bWithSelf, 0 );
		for ( i = 0; i < aModelContexts.length; i++ ) {
			eModelContext = aModelContexts[ i ];
			sBlockId = '';
			try {
				aBlockIds = oDom.parseBlockIds( eModelContext );
				if ( !aBlockIds.length ) {
					throw new Error( "not set _blockId in tag class" );
				}
				for ( let j = 0; j < aBlockIds.length; j++ ) {
					try {
						sBlockId = aBlockIds[ j ];
						if ( !this._oOpts[ sBlockId ] ) {
							throw new Error( "not set widget config" );
						}
						aPromises.push( this.widget( eModelContext, sBlockId ) );
					} catch ( oError ) {
						this._error( oError, eModelContext, sBlockId );
					}
				}
			} catch ( oError ) {
				this._error( oError, eModelContext, sBlockId );
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

	widget( eContext, sBlockId ) {
		const oCustomOpts = { ...this._oOpts[ sBlockId ] };
		const { fnBeforeNew } = oCustomOpts;
		let oNewWidget;
		return Promise
			.resolve(
				fnBeforeNew ? fnBeforeNew( oCustomOpts ) : null
			)
			.then( () => {
				const { cWidget, oProps, fnAfterNew } = this.fnDeepKey( [ 'cWidget', 'oProps', 'fnAfterNew' ], oCustomOpts, this._oOpts[ sBlockId ] );
				if ( !cWidget ) {
					throw new Error( "not set widget class" );
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
				return !bSkipRun ? oNewWidget.run() : false;
			} )
			.catch( ( mError ) => {
				this._error( mError, eContext, sBlockId, oNewWidget );
			} );
	}

	_setProps( oWidget, oProps ) {
		if( !oProps ) {
			return;
		}
		for ( let sPropName in oProps ) {
			if ( !( sPropName in oWidget ) ) {
				throw new Error( 'set widget props: ' + sPropName );
			}
			oWidget[ sPropName ] = oProps[ sPropName ];
		}
	}

	_error( mError, eContext, sBlockId, oWidget ) {
		this.oneLogger().log( { mError, eContext, sBlockId, oWidget } );
	}
}
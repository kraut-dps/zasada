import {Widget} from "@zasada/widget";
export class History extends Widget {

	oneHistoryAdapter;

	aPathParts;
	oHashParts = {};

	_oMinorPartsReset = {};
	_oState = {};
	_oWidgets = {};
	_aStates = [];
	_iStateId;

	run() {

		const oHistoryAdapter = this.oneHistoryAdapter();
		if( !oHistoryAdapter.isEnabled() ) {
			return;
		}

		/* разбор hash
		for( let sPartId in this.oHashParts ) {
			let [ sQuery, cWidget, oOpts ] = this.oHashParts[ sPartId ];
			this._other(
				sQuery,
				cWidget,
				( oWidget ) => {
					oWidget._on( '', 'changeState', ( {detail: {oWidget, oState}} ) => {
						this.updateHash( sPartId, oWidget );
					} );
					this._oState[ sPartId ] = oWidget.getHistoryState();
					this._oMinorPartsReset[ sPartId ] = oWidget.getHistoryState();
					this._oWidgets[ sPartId ] = oWidget;
				},
				oOpts
			);
		}*/


		oHistoryAdapter.onPopState( this._onPopState.bind(this) );
		this._iStateId = 1;
		oHistoryAdapter.replaceState( this._iStateId, "" );
		this._parseAnchor();
	}

	registerFrame( oFrame ) {
		const sPartId = oFrame.index();
		if( this.aPathParts.indexOf( sPartId ) === -1 ) {
			return;
		}
		oFrame._on( '', 'beforeFetch', ( {detail: {oWidget, sUrl}} ) => {
			this.updatePath( sPartId, oWidget, sUrl, false );
		} );
		oFrame._on( '', 'changeUrl', ( {detail: {oWidget, sUrl}} ) => {
			this.updatePath( sPartId, oWidget, sUrl, true );
		} );
		this._oState[sPartId] = oFrame.getHistoryState();
	}

	updatePath( sPartId, oWidget, sUrl, bReplace = false ) {
		if ( !bReplace ) {
			this._iStateId++;
			this._resetAnchor();
			const oOld = this._oState[sPartId];
			const oNew = oWidget.getHistoryState();
			this._oWidgets[sPartId] = oWidget;
			if ( !this._aStates[this._iStateId] ) {
				this._aStates[this._iStateId] = {};
			}
			this._aStates[this._iStateId][sPartId] = [oOld, oNew];
			this._oState[sPartId] = oNew;
		}


		this._updateState( sUrl, bReplace );
	}

	updateHash( sPartId, oWidget, bReplace = false ) {
		const sUrl = location.protocol + '//' + location.host + location.pathname + location.search + this._genAnchor();
		if( !bReplace ) {
			this._iStateId++;
		}
		const oOld = this._oState[ sPartId ];
		const oNew = oWidget.getHistoryState();
		this._oWidgets[ sPartId ] = oWidget;
		if( !this._aStates[ this._iStateId ] ) {
			this._aStates[ this._iStateId ] = {};
		}
		this._aStates[ this._iStateId ][ sPartId ] = [ oOld, oNew ];
		this._oState[ sPartId ] = oNew;
		this._updateState( sUrl, bReplace );
	}
	
	_updateState( sUrl, bReplace = false ) {
		const oHistoryAdapter = this.oneHistoryAdapter();
		if( bReplace ) {
			oHistoryAdapter.replaceState( this._iStateId, "", sUrl );
		} else {
			oHistoryAdapter.pushState( this._iStateId, "", sUrl );
		}
	}

	_parseAnchor() {
		// состояние выбираем из location
		let bParse = false;
		if( location.hash ) {
			const sPureHash = location.hash.substr( 0, 1 );
			if( sPureHash.substr( 0, 1 ) === '{' ) {
				const oHash = JSON.parse( sPureHash );
				for( let sPartId in oHash ) {
					if( Object.keys( this.oHashParts ).indexOf( sPartId ) === -1 ) {
						continue;
					}
					if( !bParse ) {
						this._iStateId++;
						if( !this._aStates[ this._iStateId ] ) {
							this._aStates[ this._iStateId ] = {};
						}
					}
					const oOld = this._oState[ sPartId ];
					const oNew = oHash[ sPartId ];
					this._aStates[ this._iStateId ][ sPartId ] = [ oOld, oNew ];
					this._oState[ sPartId ] = oNew;
					bParse = true;
				}
			}
		}
		if( bParse ) {
			this._updateState( location.href );
		}
	}

	_genAnchor() {
		
		const oData = {};

		for( let sPartId in this.oHashParts ) {
			let mValue = this._oState[ sPartId ];
			if( typeof mValue !== 'undefined' ) {
				oData[ sPartId ] = mValue;
			}
		}
		return '#' + JSON.stringify( oData );
	}

	_onPopState( oEvent ) {
		const iToStateId = oEvent.state;
		const iFromStateId = this._iStateId;
		const iDir = iToStateId > iFromStateId ? 1 : -1;
		let sPartId;
		let oState;
		let oWidget;
		for(
			let iStateId = iFromStateId;
			( iDir > 0 && iStateId < iToStateId ) || ( iDir < 0 && iStateId > iToStateId );
			iStateId = iStateId + iDir
		) {
			oState = this._aStates[ iStateId + ( iDir === -1 ? 0 : 1 ) ];
			for( sPartId in oState ) {
				let oNew = oState[ sPartId ][ iDir === -1 ? 0 : 1 ];
				oWidget = this._oWidgets[ sPartId ];
				this._oState[ sPartId ] = oNew;
				let bRet = oWidget.toHistoryState( oNew );
				if( !bRet && Object.keys( this.oHashParts ).indexOf( sPartId ) === -1 ) {
					oWidget.update( { sUrl: document.URL } );
				}
			}
		}
		this._iStateId = iToStateId;
	}

	_resetAnchor() {
		let oWidget, sPartId;
		for( sPartId in this.oHashParts ) {
			oWidget = this._oWidgets[ sPartId ];
			const oOld = this._oState[ sPartId ];
			const oNew = this._oMinorPartsReset[ sPartId ];
			if( oOld !== oNew ) {
				oWidget.toHistoryState( oNew );
				if( !this._aStates[ this._iStateId ] ) {
					this._aStates[ this._iStateId ] = {};
				}
				this._aStates[ this._iStateId ][ sPartId ] = [ oOld, oNew ];
			}
		}
	}
}
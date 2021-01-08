/**
 * механизм отображения слоев
 */
import {Widget} from "@zasada/widget";

export class Layers extends Widget {
	static DEFAULT = 1; // вызван просто метод hide
	static FRAME = 2; // frame json ответ от сервера
	static OVERLAY = 3; // клик по области вокруг слоя
	static STACK = 4; // вызыван hide с sFrameId

	sFrameBlockId;
	fnDeepKey;
	iNextId = 1;

	_bShow = false;
	_oLayers = {};
	_aStack = [];
	_aClassesFrame;
	_aClassesAvail = [];

	sHistoryBlockId = '';
	sHistoryPart = '';

	run() {
		this._on( window, 'resize', this.onResize.bind( this ) );
		/*if( this.sHistoryBlockId ) {
			if( !this.sHistoryPart ) {
				this.sHistoryPart = this.constructor.name;
			}
			this._other( this.sHistoryBlockId, Widget, ( oHistory ) => {
				oHistory.registerPart( this.sHistoryPart, this );
			} );
		}*/
	}
	
	show( oOpts = {} ) {

		if( !oOpts.sFrameId ) {
			oOpts.sFrameId = 'frame_' + this.iNextId++;
		}

		if( !oOpts.sLayer ) {
			oOpts.sLayer = 'Layer';
		}

		return this._getLayer( oOpts ).then( ( oLayer ) => {
			return oLayer.reset( this._layerOpts( oOpts ), this._frameOpts( oOpts ) ).then( () => {

				// модифицируем _aStack
				const iIndex = this._aStack.indexOf( oOpts.sFrameId );
				if( iIndex !== -1 ) {
					this._aStack = this._aStack.slice( 0, iIndex + 1 );
				} else {
					this._aStack.push( oOpts.sFrameId );
				}

				this._setVisible();
				this._afterUpdate();
				return oLayer.promise();
			} );
		} );
	}
	
	hide( oOpts = {} ) {

		if( !this._aStack.length ) {
			return;
		}

		let sFrameId;
		if( typeof oOpts.iHideType === 'undefined' ) {
			oOpts.iHideType = Layers.DEFAULT;
		}
		do{
			sFrameId = this._aStack[ this._aStack.length - 1 ];
			if( oOpts.sFrameId === sFrameId ) {
				break;
			}
			this._aStack.pop();

			if( typeof oOpts.sFrameId === 'undefined' ) {
				break;
			}

			let oLayer = this._oLayers[ sFrameId ];
			oLayer.resolve( {
				iHideType: Layers.STACK,
				oCustomData: oOpts.oCustomData
			} );

		} while( this._aStack.length );

		this._setVisible();
		
		if( sFrameId ) {

			let oLayer = this._oLayers[ sFrameId ];
			oLayer.resolve( {
				iHideType: oOpts.iHideType,
				oCustomData: oOpts.oCustomData
			} );
		}

		this._afterUpdate();
	}
	
	_getLayer( oOpts ) {
		const sFrameId = oOpts.sFrameId;
		let oLayer = this._oLayers[ sFrameId ];
		if( oLayer ) {
			return Promise.resolve( oLayer );
		}

		const eNew = document.createElement( 'div' );
		eNew.className = '_ _' + oOpts.sLayer + ' layer';
		eNew.setAttribute( 'data-frame-id', sFrameId );

		// @ts-ignore
		this._el( 'Body' ).appendChild( eNew );

		let oCodeOpts = {
			oProps: this._layerOpts( oOpts )
		};

		return this._widget( eNew, oOpts.sLayer, oCodeOpts ).then( ( oLayer ) => {
			this._oLayers[ sFrameId ] = oLayer;
			const sClass = oLayer.getClassLayers();
			if( this._aClassesAvail.indexOf( sClass ) === -1 ) {
				this._aClassesAvail.push( sClass );
			}
			oLayer.setLayers( this );
			return this._oLayers[ sFrameId ];
		} );
	}

	/**
	 * добавить/удалить необходимые классы css элементам
	 * @param aOldStack
	 */
	_modByStack( aOldStack = null ) {
		for( let sFrameId in this._oLayers ) {
			const oLayer = this._oLayers[ sFrameId ];
			//const eFrame  = oLayer.bl();
			const iIndexOfStack = this._aStack.indexOf( sFrameId );
			if( iIndexOfStack === -1 ) {
				//this._mod( eFrame, this._aClassesFrame, this.sClassLayerNone );
				oLayer.state( null );
			} else if( iIndexOfStack === this._aStack.length - 1 ) {
				//const bHide = aOldStack && aOldStack.indexOf( sFrameId ) === -1;
				//this._mod( eFrame, this._aClassesFrame, bHide ? this.sClassLayerHide : '' );
				oLayer.state( 0 );
			} else {
				//this._mod( eFrame, this._aClassesFrame, this.sClassLayerBack );
				oLayer.state( iIndexOfStack -  this._aStack.length );
			}
		}
	}
	
	_setVisible() {

		this._bShow = this._aStack.length > 0;

		let aClassLayers = [];
		for( let i = 0; i < this._aStack.length; i++ ) {
			const sFrameId = this._aStack[ i ];
			const oLayer = this._oLayers[ sFrameId ];
			let sClassLayers = oLayer.getClassLayers();
			if( aClassLayers.indexOf( sClassLayers ) === -1 ) {
				aClassLayers.push( sClassLayers );
			}
		}
		for( let i = 0; i < this._aClassesAvail.length; i++ ) {
			let sClass = this._aClassesAvail[ i ];
			this._mod( '', sClass, aClassLayers.indexOf( sClass ) !== -1 );
		}
		this._modByStack();
	}
	
	realign() {
		if( !this._aStack.length ) {
			return;
		}
		const sLastFrameId = this._aStack[ this._aStack.length - 1 ];
		this._oLayers[ sLastFrameId ].align();
	}

	/*onOverlayClick( oEvent ) {

		if( !this._aStack.length ) {
			return false;
		}

		if( oEvent === this._oLastEvent ) {
			return false;
		}

		const sFrameId = this._aStack[ this._aStack.length - 1 ];
		const oLayer = this._oLayers[ sFrameId ];
		const eFrame = oLayer.bl();
		if( eFrame.contains( oEvent.target ) && eFrame !== oEvent.target ) {
			return false;
		}
		this.hide( { iHideType: this.constructor.OVERLAY } );
	}*/
	
	onResize() {
		if( this._bShow ) {
			this.realign();
		}
	}

	getHistoryState() {
		const oRet = {};
		if( !this._aStack.length ) {
			return oRet;
		}
		this._aStack.forEach( ( sFrameId ) => {
			oRet[ sFrameId ] = this._oLayers[ sFrameId ].getUrl();
		} );
		return oRet;
	}

	toHistoryState( oState ) {
		this._aStack = [];
		for( let sFrameId in oState ) {
			let sUrl = oState[ sFrameId ];
			this._aStack.push( sFrameId );
			this._getLayer( sFrameId ).then( ( oLayer ) => {
				if( oLayer.getUrl() !== sUrl ) {
					oLayer.oFrame.update( {
						sUrl: sUrl
					} );
				}
			} );
		}
		this._setVisible();
	}

	_afterUpdate() {
		/*if( this.sHistoryBlockId ) {
			this._other( this.sHistoryBlockId, Widget, ( oHistory ) => {
				oHistory.updateHash(
					this.sHistoryPart,
					this,
					false
				);
			} );
		}*/
		this._fire( this.bl(), 'changeState', { oWidget: this, oState: this.getHistoryState() } )
	}

	_frameOpts( oOpts ) {
		return this.fnDeepKey(
			[
				'sUrl',
				'oFormData',
				'bPost',
				'sContent',
				'bCache',
				'oCustomData',
			],
			oOpts
		);
	}

	_layerOpts( oOpts ) {
		return {
			bPromise: !!oOpts.bPromise,
			eBtn: oOpts.eBtn || null,
			sFrameBlockId: this.sFrameBlockId
		};
	}

	_renewPromise( oFrame ) {
		oFrame.promise().then( ( oCustomData ) => {
			const sPrevFrameId = this._aStack[this._aStack.length - 2];
			this.hide( {
				iHideType: Layers.FRAME,
				oCustomData: oCustomData,
				sFrameId: sPrevFrameId
			} );
			return oCustomData;
		} );
	}
}
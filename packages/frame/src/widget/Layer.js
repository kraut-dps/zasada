/**
 * слой
 */
import {Widget} from "@zasada/widget";
export class Layer extends Widget {

	static C_NEAR_BTN_ABS = 1;
	static C_NEAR_BTN_FIX = 2;

	bPromise = null;
	oFrameOpts = null;
	sClassLayers = null;
	sClass = null;
	eBtn = null;
	iAlign = 0;
	bDocClickHide = false;
	_fnDocClick;

	sFrameBlockId;

	sClassShow = 'layer_show';
	sClassHide = 'layer_hide';
	sClassBack = 'layer_back';
	sClassNone = 'layer_none';
	_aClassesState = [];

	_oLayers;
	_oPromise
	_oFrame;

	run() {

		this._aClassesState = [ this.sClassShow, this.sClassNone, this.sClassHide, this.sClassBack ];

		this._mod( '', '_' + this.sFrameBlockId, true );
		return this._widget( this.bl(), this.sFrameBlockId ).then( ( oFrame ) => {
			this._oFrame = oFrame;
			return oFrame;
		} );
	}

	/**
	 * @param {number|null} mState 0 - active -x back, null - none
	 */
	state( mState ) {
		let sClass, bDocClick;
		if( mState === 0 ) {
			// сначала выведем его, но скроем, чтобы были размеры доступны
			this._mod( '', this._aClassesState, this.sClassHide );

			// выровняем
			this.align();

			// и только потом можно показывать
			sClass = this.sClassShow;
			bDocClick = true;
		} else if( mState === null ) {
			sClass = this.sClassNone;
			bDocClick = false;
		} else if( mState < 0 ) {
			sClass = this.sClassBack
			bDocClick = false;
		}
		if( this.bDocClickHide ) {
			if(	bDocClick ) {
				this.addDocClickHide();
			} else {
				this.dropDocClickHide();
			}
		}

		this._mod( '', this._aClassesState, sClass );
	}

	reset( oOpts, oFrameOpts ) {
		Object.assign( this, oOpts );
		this.oFrameOpts = oFrameOpts;
		this.promiseRenew();
		return this.frameUpdate().then( ( mRet ) => {
			this._mod( '', this.sClass, true );
			return mRet;
		} );
	}

	frameUpdate() {
		return this._oFrame.update( this.oFrameOpts );
	}

	promiseRenew() {
		if( this.bPromise ) {
			this._oPromise = new Promise( ( fnResolve, fnReject ) => {
				this.resolve = fnResolve;
				this.reject = fnReject;
			} );
		}
	}

	resolve( mValue ) {}

	reject( mValue ) {}

	promise() {
		return this._oPromise;
	}

	getClassLayers() {
		return this.sClassLayers;
	}

	getUrl() {
		return this.oFrameOpts ? this.oFrameOpts.sUrl : '';
	}

	getFrameId() {
		return this._oFrame.getFrameId();
	}

	setLayers( oLayers ) {
		this._oLayers = oLayers;
	}

	align( bForce = false ) {
		if( !this.iAlign || !this.eBtn ) {
			return;
		}

		const eBlock = this.bl();
		const eBtn = this.eBtn;
		const oBtnRect = eBtn.getBoundingClientRect();

		const fWindowWidth = document.documentElement.clientWidth;
		const fWindowHeight = document.documentElement.clientHeight;

		// пробуем снизу справа
		let bBottom = true;
		let bRight = true;
		let bChange = false;
		let oRect = this._calcRect( oBtnRect, eBlock, bBottom, bRight );
		if( oRect.fRight > fWindowWidth ) {
			bRight = false;
			bChange = true;
		}
		if( oRect.fBottom > fWindowHeight ) {
			bBottom = false;
			bChange = true;
		}
		if( bChange ) {
			oRect = this._calcRect( oBtnRect, eBlock, bBottom, bRight );
		}

		let { fLeft, fTop } = oRect;

		if( this.iAlign === Layer.C_NEAR_BTN_ABS ) {
			fLeft += typeof window.scrollX === 'undefined' ? window.pageXOffset : window.scrollX;
			fTop += typeof window.scrollY === 'undefined' ? window.pageYOffset : window.scrollY;
		}

		// заменить бы на transform

		// @ts-ignore
		eBlock.style.left = parseInt( fLeft ) + 'px';

		// @ts-ignore
		eBlock.style.top = parseInt( fTop ) + 'px';
	}

	_calcRect( oBtnRect, eBlock, bBottom = true, bRight = true ) {
		const fPopupWidth = eBlock.clientWidth;
		const fPopupHeight = eBlock.clientHeight;
		let fLeft, fRight, fTop, fBottom;
		if( bRight ) {
			fLeft = oBtnRect.left;
		} else {
			fLeft = oBtnRect.left - fPopupWidth + oBtnRect.width;
		}
		fRight = fLeft + fPopupWidth;
		if( bBottom ) {
			fTop = oBtnRect.top + oBtnRect.height;
		} else {
			fTop = oBtnRect.top - fPopupHeight;
		}
		fBottom = fTop + fPopupHeight;
		return { fLeft, fRight, fTop, fBottom };
	}

	addDocClickHide() {
		if( this._fnDocClick ) {
			return;
		}

		this._fnDocClick = ( oEvent ) => {
			const eBlock = this.bl();
			if ( eBlock !== oEvent.target && eBlock.contains( oEvent.target ) ) {
				return false;
			}
			this.dropDocClickHide();
			this._oLayers.hide( { iHideType: this._oLayers.constructor.OVERLAY } );
		};

		setTimeout( () => { this._on( document, 'click', this._fnDocClick ); }, 0 );
	}

	dropDocClickHide() {
		if( !this._fnDocClick ) {
			return;
		}
		this._off( document, 'click', this._fnDocClick );
		this._fnDocClick = null;
	}
}
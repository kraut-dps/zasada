/**
 * @typedef {import('./interfaces').ICustomError} ICustomError
 * @typedef {import('@zasada/core/src/interfaces').IWidget} IWidget
 */
/**
 * расширенный класс ошибки, чтобы иметь больше данных для разбирательств
 * @implements ICustomError
 */
export class CustomError {

	message = '';
	name = 'Zasada';
	stack = '';

	/**
	 * @type {string} error help code
	 */
	sHelp = '';

	/**
	 * @type {any} origin exception
	 */
	mOrigin = null;

	/**
	 * @type {IWidget}
	 */
	oWidget = null;

	/**
	 * @type {Element}
	 */
	eContext = null;

	/**
	 * @type {string}
	 */
	sBlockId = '';

	/**
	 * @type {string}
	 */
	sStackMapped = '';

	/**
	 * @type {boolean|null}
	 */
	bSkipLog = null;

	constructor() {
		this.stack = (new Error()).stack || null;
	}

	errorOrigin() {
		return this.mOrigin;
	}

	msg() {
		return this.mOrigin ? ( typeof this.mOrigin === 'string' ? this.mOrigin : this.mOrigin.message ) : this.message;
	}

	help() {
		return this.sHelp ? 'https://github.com/kraut-dps/zasada/#' + this.sHelp : '';
	}

	blockId() {
		return ( this.oWidget ? this.oWidget.blockId() : this.sBlockId ) || '';
	}

	stackOrigin() {
		let sStack = '';
		if ( this.mOrigin ) {
			let mOrigin = this.mOrigin;
			if( mOrigin.stack ) {
				sStack = mOrigin.stack;
			} else if( mOrigin.sourceURL ) {
				sStack = mOrigin.message + "\n@" + mOrigin.sourceURL + ':' + mOrigin.line + ":" + ( mOrigin.column || 1 );
			}
		} else {
			sStack = this.stack;
		}
		return sStack;
	}

	setStackMapped( sStackMapped ) {
		this.sStackMapped = sStackMapped;
	}

	stackMapped() {
		return this.sStackMapped;
	}

	context() {
		return ( this.oWidget ? this.oWidget.bl() : this.eContext ) || null;
	}

	contextHtml( iSubStr = 100 ) {
		let eContext = this.context();
		if( !eContext ) {
			return '';
		}
		let sHtml = eContext.outerHTML.substr( 0, iSubStr ).trim();
		const iPos = sHtml.indexOf( '>' );
		if( iPos === -1 ) {
			return sHtml + '...';
		} else {
			return sHtml.substr( 0, iPos + 1 );
		}
	}

	widget() {
		return this.oWidget;
	}

	widgetClass() {
		if( this.oWidget && this.oWidget.constructor ) {
			return this.oWidget.constructor.name;
		}
		return '';
	}

	skipLog() {
		if( this.bSkipLog !== null ) {
			return this.bSkipLog;
		}
		if( this.mOrigin && this.mOrigin instanceof CustomError ) {
			return this.mOrigin.skipLog();
		}
		return false;
	}
}
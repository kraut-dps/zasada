class CustomError extends window.Error {

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

	stackOrigin() {
		let sStack = '';
		if( this.mOrigin ) {
			let mOrigin = this.mOrigin;
			if( mOrigin.stack ) {
				sStack = mOrigin.stack;
			} else if( mOrigin.sourceURL ) {
				sStack = mOrigin.message + "\n@" + mOrigin.sourceURL + ':' + mOrigin.line + ":1";
			}
		} else if( this.stack ) {
			sStack = this.stack;
		}
		return sStack;
	}

	data() {
		return {
			sMessage: this.mOrigin ? ( typeof this.mOrigin === 'string' ? this.mOrigin : this.mOrigin.message ) : this.message,
			sHelp: this.name ? 'https://github.com/kraut-dps/zasada/#' + this.name : '',
			sBlockId: ( this.oWidget ? this.oWidget.blockId() : this.sBlockId ) || '',
			eContext: ( this.oWidget ? this.oWidget.bl() : this.eContext ) || null,
			oWidget: this.oWidget,
			mOrigin: this.mOrigin,
			sStackMapped : this.sStackMapped
		};
	}
}
export {CustomError as Error};
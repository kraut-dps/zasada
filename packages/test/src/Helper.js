/**
 * @typedef {import('./interfaces').IHelper} IHelper
 */
/**
 * небольшой вспомогательный класс для организации тестов
 * @implements IHelper
 */
export class Helper{

	oneLinker;
	_eContext;

	/**
	 * @deprecated
	 * use addHtml*
	 */
	addHtml( sHtml ) {
		return this.addHtmlAll( sHtml );
	}

	/**
	 * @param {string} sHtml
	 * @return {Promise<any[]>[]}
	 */
	addHtmlPromises( sHtml ) {
		const eDiv = document.createElement( 'div' );
		eDiv.innerHTML = sHtml;
		document.body.appendChild( eDiv );
		this._eContext = eDiv;
		return this.oneLinker().linkPromises( eDiv );
	}

	/**
	 * @param {string} sHtml
	 * @return {Promise<any[]>}
	 */
	addHtmlAll( sHtml ) {
		return Promise.all( this.addHtmlPromises( sHtml ) );
	}

	/**
	 * @param {string} sHtml
	 * @return {Promise<any[]>}
	 */
	addHtmlAllSettled( sHtml ) {
		return Promise.allSettled( this.addHtmlPromises( sHtml ) );
	}

	destroy() {
		this.oneLinker().unlink( this._eContext );
		this._eContext.parentNode.removeChild( this._eContext );
	}

	element( sSelector ) {
		return this._eContext.querySelector( sSelector );
	}

	widget( sSelector, cWidget ) {
		const eFrom = this.element( sSelector );
		return this.oneLinker().newRelQuery()
			.from( eFrom )
			.onlyFirst( true )
			.typeOf( cWidget )
			.find();
	}

	getRejectResults( aResults ) {
		return aResults.filter( ( oResult ) => {
			return oResult.status === "rejected";
		});
	}
}
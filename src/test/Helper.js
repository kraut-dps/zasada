export class Helper{

	oneLinker;
	_eContext;

	addHtml( sHtml ) {
		const eDiv = document.createElement( 'div' );
		eDiv.innerHTML = sHtml;
		document.body.appendChild( eDiv );
		this._eContext = eDiv;
		return this.oneLinker().link( eDiv );
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
			//.cssSel( sSelector )
			.onlyFirst( true )
			.typeOf( cWidget )
			.find();
	}
}
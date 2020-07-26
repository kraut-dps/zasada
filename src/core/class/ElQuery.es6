/**
 * формирование запроса на поиск елемента внутри блока
 * @implements IElQuery
 */
export class ElQuery {
	
	sId = '';
	bOnlyFirst = true;
	bCanEmpty = false;
	bWithFrom = true;
	bNoCache = false;

	constructor( sQuery ) {
		this.parse( sQuery );
	}

	parse( sQuery ) {
		if( typeof sQuery !== 'string' ) {
			return;
		}

		let aQuery = sQuery.split( "" );
		aQuery = this._parseDir( aQuery.reverse() );
		aQuery = this._parseDir( aQuery.reverse() );
		this.id( aQuery.join( '' ) );
	}

	_parseDir( aQuery ) {
		let sChar;
		let iIndex = 0;
		while( ( sChar = aQuery[ iIndex ] ) ) {
			switch( sChar ) {
				case '=':
					this.noCache( true );
					iIndex++;
					break;
				case '>':
					this.withFrom( false );
					iIndex++;
					break;
				case '?':
					this.canEmpty( true );
					iIndex++;
					break;
				case ']':
					if( aQuery[ iIndex + 1 ] === '[' ) {
						this.onlyFirst( false );
						iIndex += 2;
						break;
					}
					throw new Error( 'bad el: ' + aQuery.join( '' ) );
				default:
					return aQuery.slice( iIndex );
			}
		}
		throw new Error( 'bad el: ' + aQuery.join( '' ) );
	}

	key() {
		return this.sId + ( !this.bOnlyFirst ? '[]' : '' ) + ( !this.bWithFrom ? '>' : '' );
	}

	/**
	 * @param {string} sId
	 * @return {IElQuery}
	 */
	id( sId ) {
		this.sId = sId;
		return this;
	}
	

	/**
	 * @param {boolean} bWithFrom
	 * @return {IElQuery}
	 */
	withFrom( bWithFrom ) {
		this.bWithFrom = bWithFrom;
		return this;
	}
	
	/**
	 * @param {boolean} bCanEmpty
	 * @return {IElQuery}
	 */
	canEmpty( bCanEmpty ) {
		this.bCanEmpty = bCanEmpty;
		return this;
	}
	
	/**
	 * @param {boolean} bOnlyFirst
	 * @return {IElQuery}
	 */
	onlyFirst( bOnlyFirst ) {
		this.bOnlyFirst = bOnlyFirst;
		return this;
	}

	/**
	 * @param {boolean} bNoCache
	 * @return {IElQuery}
	 */
	noCache( bNoCache ) {
		this.bNoCache = bNoCache;
		return this;
	}
}
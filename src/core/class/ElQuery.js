/**
 * формирование запроса на поиск елемента внутри блока
 * @implements IElQuery
 */
export class ElQuery {

	newError;

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

	/**
	 * разбирает запрос справа налево
	 * @param {string[]} aQuery
	 * @return {string[]}
	 * @private
	 */
	_parseDir( aQuery ) {
		let sChar;
		let iIndex = 0;
		try {
			while ( ( sChar = aQuery[iIndex] ) ) {
				switch ( sChar ) {
					case '=':
						this.noCache( true );
						break;
					case '>':
						this.withFrom( false );
						break;
					case '?':
						this.canEmpty( true );
						break;
					case ']':
						if ( aQuery[iIndex + 1] === '[' ) {
							this.onlyFirst( false );
							iIndex++;
							break;
						}
						throw '';
					default:
						return aQuery.slice( iIndex );
				}
				iIndex++;
			}
		} catch( e ) {}
		throw this.newError( { message: 'Bad el query "' + aQuery.join( '' ) + '"', name: 'element-query-parse' } );
	}

	key() {
		return this.sId + ( !this.bOnlyFirst ? '[]' : '' ) + ( !this.bWithFrom ? '>' : '' );
	}

	/**
	 * @param {string} sId
	 * @return {IElQuery|this}
	 */
	id( sId ) {
		this.sId = sId;
		return this;
	}
	

	/**
	 * @param {boolean} bWithFrom
	 * @return {IElQuery|this}
	 */
	withFrom( bWithFrom ) {
		this.bWithFrom = bWithFrom;
		return this;
	}
	
	/**
	 * @param {boolean} bCanEmpty
	 * @return {IElQuery|this}
	 */
	canEmpty( bCanEmpty ) {
		this.bCanEmpty = bCanEmpty;
		return this;
	}
	
	/**
	 * @param {boolean} bOnlyFirst
	 * @return {IElQuery|this}
	 */
	onlyFirst( bOnlyFirst ) {
		this.bOnlyFirst = bOnlyFirst;
		return this;
	}

	/**
	 * @param {boolean} bNoCache
	 * @return {IElQuery|this}
	 */
	noCache( bNoCache ) {
		this.bNoCache = bNoCache;
		return this;
	}
}
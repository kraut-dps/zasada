/**
 * формирование запроса на поиск виджетов
 * @implements IRelQuery
 */
export class RelQuery{
	
	_fnStorage;
	eFrom = null;
	bWithFrom = true;
	iWay = 0;
	bOnlyFirst = true;
	cTypeOf = null;
	aBlockIds = null;
	aIndex = [];
	sCssSel = '';
	bCanEmpty = false;
	
	constructor( fnStorage ) {
		this._fnStorage = fnStorage;
	}
	
	/**
	 * @param {string|string[]} mBlockId
	 * @return IRelQuery
	 */
	blockId( mBlockId ) {
		if( this.aBlockIds === null ) {
			this.aBlockIds = [];
		}
		if( typeof mBlockId === 'string' ) {
			this.aBlockIds.push( mBlockId );
		} else {
			this.aBlockIds = mBlockId;
		}
		return this;
	}
	
	/**
	 * @param {Element|null} eFrom
	 * @param {boolean|null} bWithFrom
	 * @return {IRelQuery}
	 */
	parents( eFrom = null, bWithFrom = null ) {
		if( eFrom !== null ) {
			this.from( eFrom );
		}
		if( bWithFrom !== null ) {
			this.withFrom( bWithFrom );
		}
		this.iWay = -1;
		return this;
	}
	
	/**
	 * @param {Element|null} eFrom
	 * @param {boolean|null} bWithFrom
	 * @return {IRelQuery}
	 */
	children( eFrom = null, bWithFrom = null ) {
		if( eFrom !== null ) {
			this.from( eFrom );
		}
		if( bWithFrom !== null ) {
			this.withFrom( bWithFrom );
		}
		this.iWay = 1;
		return this;
	}
	
	/**
	 * @param {Element} eFrom
	 * @return {IRelQuery}
	 */
	from( eFrom ) {
		this.eFrom = eFrom;
		return this;
	}
	
	/**
	 * @param {boolean} bWithFrom
	 * @return {IRelQuery}
	 */
	withFrom( bWithFrom = true ) {
		this.bWithFrom = bWithFrom;
		return this;
	}
	
	/**
	 * @param {string} sCssSel
	 * @return {IRelQuery}
	 */
	cssSel( sCssSel ) {
		this.sCssSel = sCssSel;
		return this;
	}
	
	/**
	 * @param {string|string[]} mIndex
	 * @return {IRelQuery}
	 */
	index( mIndex ) {
		if( typeof mIndex === 'string' ) {
			this.aIndex.push( mIndex );
		} else {
			this.aIndex = mIndex;
		}
		return this;
	}
	
	/**
	 * @param {boolean} bCanEmpty
	 * @return {IRelQuery}
	 */
	canEmpty( bCanEmpty = true ) {
		this.bCanEmpty = bCanEmpty;
		return this;
	}
	
	/**
	 * @param {boolean} bOnlyFirst
	 * @return {IRelQuery}
	 */
	onlyFirst( bOnlyFirst = true ) {
		this.bOnlyFirst = bOnlyFirst;
		return this;
	}
	
	/**
	 * @param {function} cTypeOf
	 * @return {IRelQuery}
	 */
	typeOf( cTypeOf ) {
		this.cTypeOf = cTypeOf;
		return this;
	}
	
	/**
	 * @param {boolean|null} bAll
	 * @return {Widget|Widget[]}
	 */
	find( bAll = null ) {
		if( bAll !== null ) {
			this.onlyFirst( !bAll );
		}
		const aRet = this._fnStorage().find( this );
		if( this.bOnlyFirst ) {
			return typeof( aRet[ 0 ] ) !== 'undefined' ? aRet[ 0 ] : null;
		}
		return aRet;
	}
}
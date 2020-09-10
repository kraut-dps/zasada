/**
 * формирование запроса на поиск виджетов
 * @implements IRelQuery
 */
export class RelQuery{

	_fnStorage;
	eFrom = null;
	bWithFrom = true;

	/**
	 * all, child, parent, next, prev, self
	 * @type {string}
	 */
	sWay = 'all';

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
	 * @return {IRelQuery|this}
	 */
	blockId( mBlockId ) {
		if( typeof mBlockId === 'string' ) {
			this.aBlockIds = [ mBlockId ];
		} else {
			this.aBlockIds = mBlockId;
		}
		return this;
	}
	
	parent() {
		this.sWay = 'parent';
		return this;
	}

	child() {
		this.sWay = 'child';
		return this;
	}

	next() {
		this.sWay = 'next';
		return this;
	}

	prev() {
		this.sWay = 'prev';
		return this;
	}

	self() {
		this.sWay = 'self';
		return this;
	}

	/**
	 * @param {Element} eFrom
	 * @return {IRelQuery|this}
	 */
	from( eFrom ) {
		this.eFrom = eFrom;
		return this;
	}
	
	/**
	 * @param {boolean} bWithFrom
	 * @return {IRelQuery|this}
	 */
	withFrom( bWithFrom = true ) {
		this.bWithFrom = bWithFrom;
		return this;
	}
	
	/**
	 * @param {string} sCssSel
	 * @return {IRelQuery|this}
	 */
	cssSel( sCssSel ) {
		this.sCssSel = sCssSel;
		return this;
	}
	
	/**
	 * @param {string|string[]} mIndex
	 * @return {IRelQuery|this}
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
	 * @return {IRelQuery|this}
	 */
	canEmpty( bCanEmpty = true ) {
		this.bCanEmpty = bCanEmpty;
		return this;
	}
	
	/**
	 * @param {boolean} bOnlyFirst
	 * @return {IRelQuery|this}
	 */
	onlyFirst( bOnlyFirst = true ) {
		this.bOnlyFirst = bOnlyFirst;
		return this;
	}
	
	/**
	 * @param {function} cTypeOf
	 * @return {IRelQuery|this}
	 */
	typeOf( cTypeOf ) {
		this.cTypeOf = cTypeOf;
		return this;
	}
	
	/**
	 * @param {boolean|null} bAll
	 * @return {IWidget|IWidget[]}
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
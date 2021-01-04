/**
 * @typedef {import('./../interfaces').IRelQuery} IRelQuery
 * @typedef {import('./../interfaces').IRelQueryInit} IRelQueryInit
 * @typedef {import('./../interfaces').IStorage} IStorage
 * @typedef {import('./../interfaces').IWidget} IWidget
 */
/**
 * формирование запроса на поиск виджетов
 * @implements IRelQueryInit
 */
export class RelQuery{

	cTypeOf = null;
	eFrom = null;
	bWithFrom = true;

	/**
	 * all, child, parent, next, prev, self
	 * @type {string}
	 */
	sWay = 'all';
	bOnlyFirst = true;
	aBlockIds = null;
	aIndex = [];
	sCssSel = '';
	bCanEmpty = false;

	/**
	 * @type {function():IStorage}
	 */
	oneStorage;

	_oWidget = null;

	/**
	 * @param cTypeOf
	 * @return {RelQuery}
	 */
	typeOf( cTypeOf ) {
		this.cTypeOf = cTypeOf;
		return this;
	}

	/**
	 * @return {RelQuery}
	 */
	parent() {
		this.sWay = 'parent';
		return this;
	}

	/**
	 * @return {RelQuery}
	 */
	child() {
		this.sWay = 'child';
		return this;
	}

	/**
	 * @return {RelQuery}
	 */
	next() {
		this.sWay = 'next';
		return this;
	}

	/**
	 * @return {RelQuery}
	 */
	prev() {
		this.sWay = 'prev';
		return this;
	}

	/**
	 * @return {RelQuery}
	 */
	self() {
		this.sWay = 'self';
		return this;
	}

	/**
	 * @param {Element} eFrom
	 * @return {RelQuery}
	 */
	from( eFrom ) {
		this.eFrom = eFrom;
		return this;
	}
	
	/**
	 * @param {boolean} bWithFrom
	 * @return {RelQuery}
	 */
	withFrom( bWithFrom = true ) {
		this.bWithFrom = bWithFrom;
		return this;
	}

	/**
	 * @param {string|string[]} mIndex
	 * @return {RelQuery}
	 */
	index( mIndex ) {
		if( typeof mIndex === 'object' && Array.isArray( mIndex ) ) {
			this.aIndex = mIndex;
		} else {
			this.aIndex.push( mIndex );
		}
		return this;
	}

	/**
	 * @param {string} sCssSel
	 * @return {RelQuery}
	 */
	cssSel( sCssSel ) {
		this.sCssSel = sCssSel;
		return this;
	}
	
	/**
	 * @param {boolean} bCanEmpty
	 * @return {RelQuery}
	 */
	canEmpty( bCanEmpty = true ) {
		this.bCanEmpty = bCanEmpty;
		return this;
	}
	
	/**
	 * @param {boolean} bOnlyFirst
	 * @return {RelQuery}
	 */
	onlyFirst( bOnlyFirst = true ) {
		this.bOnlyFirst = bOnlyFirst;
		return this;
	}

	/**
	 * @param oWidget
	 * @return {RelQuery}
	 */
	widget( oWidget ) {
		this._oWidget = oWidget;
		return this;
	}

	getWidget() {
		return this._oWidget;
	}

	/**
	 * @param {string|string[]} mBlockId
	 * @return {RelQuery}
	 */
	blockId( mBlockId ) {
		if( typeof mBlockId === 'string' ) {
			this.aBlockIds = [ mBlockId ];
		} else {
			this.aBlockIds = mBlockId;
		}
		return this;
	}

	/**
	 * @param bAll
	 * @return {any}
	 */
	find( bAll = null ) {
		if( bAll !== null ) {
			this.onlyFirst( !bAll );
		}
		const aRet = this.oneStorage().find( this );
		if( this.bOnlyFirst ) {
			return typeof( aRet[ 0 ] ) !== 'undefined' ? aRet[ 0 ] : null;
		}
		return aRet;
	}

	/**
	 * @return {any}
	 */
	getQuery() {
		/**
		 * @type {any} // TS2536
		 */
		const oQuery = {};
		for( let sKey in this ) {
			if( sKey.substr( 0, 1 ) === '_' ) {
				continue;
			}
			if( sKey === 'oneStorage' ) {
				continue;
			}
			oQuery[ sKey ] = this[ sKey ];
		}
		return oQuery;
	}

	/**
	 * добавить обработчик события
	 * @param sEvent
	 * @param fnHandler
	 * @return {RelQuery}
	 */
	on( sEvent, fnHandler ) {
		this.oneStorage().on( this, sEvent, fnHandler );
		return this;
	}

	/**
	 * убрать обработчик события
	 */
	/*off( sEvent, fnHandler ) {
		this.oneStorage().off( this, sEvent, fnHandler );
		return this;
	}*/

	/**
	 * @deprecated
	 * use this.on()
	 */
	onAdd( fnHandler ) {
		return this.on( 'add', fnHandler );
	}

	/**
	 * @deprecated
	 * use this.on()
	 */
	onDrop( fnHandler ) {
		return this.on( 'drop', fnHandler );
	}
}
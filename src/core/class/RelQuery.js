/**
 * формирование запроса на поиск виджетов
 * @implements IRelQuery
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
	_oEventsMap;
	_bDropOff = false;

	/**
	 * @param {function} cTypeOf
	 * @return {IRelQuery|this}
	 */
	typeOf( cTypeOf ) {
		this.cTypeOf = cTypeOf;
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
	 * @param {string|string[]} mIndex
	 * @return {IRelQuery|this}
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
	 * @return {IRelQuery|this}
	 */
	cssSel( sCssSel ) {
		this.sCssSel = sCssSel;
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
	
	widget( oWidget ) {
		this._oWidget = oWidget;
		return this;
	}

	getWidget() {
		return this._oWidget;
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

	/**
	 * @param {boolean|null} bAll
	 * @return {IWidget|IWidget[]}
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

	getQuery() {
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
	 * при добавлении в хранилище виджета с этими условиями, будет срабатывать
	 * @param fnHandler
	 * @return {RelQuery}
	 */
	onAdd( fnHandler ) {
		return this._storageOn( this, 'add', fnHandler );
	}

	/**
	 * при удалении из хранилища виджаета с этими условиями, будет срабатывать
	 * @param fnHandler
	 * @return {RelQuery}
	 */
	onDrop( fnHandler ) {
		return this._storageOn( this, 'drop', fnHandler );
	}

	_storageOn( cTypeOf, sEvent, fnHandler ) {
		this.oneStorage().on( this, sEvent, fnHandler );

		// если из виджета, то при удалении виджета, надо удалить и обработчики его
		if( this._oWidget ) {
			if ( !this._oEventsMap ) {
				this._oEventsMap = new WeakMap();
			}
			let aEventHandlers = this._oEventsMap.get( this._oWidget );
			if( !aEventHandlers ) {
				aEventHandlers = [];
			}
			const oRelQuery = this;
			aEventHandlers.push( { oRelQuery, sEvent, fnHandler } );
			this._oEventsMap.set( this._oWidget, aEventHandlers );
			if( !this._bDropOff ) {
				this.oneStorage().on( new RelQuery(), 'drop', this._onDropOff.bind( this ) );
				this._bDropOff = true;
			}
		}
		return this;
	}

	/**
	 * срабатывает при удалении видета, удаляет обработчики из этого виджета
	 * @param oWidget
	 * @param sEvent
	 */
	_onDropOff( oWidget, sEvent ) {
		let aEventHandlers = this._oEventsMap.get( oWidget );
		if( !aEventHandlers ) {
			return;
		}
		aEventHandlers.forEach( ( {oRelQuery, sEvent, fnHandler} ) => {
			this.oneStorage().off( oRelQuery, sEvent, fnHandler );
		} );
	}
}
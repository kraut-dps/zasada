/**
 * работа с DOM деревом
 * @implements IDom
 */
export class Dom {

	/**
	 * найти потомков относительно переданого
	 * @param {Element} eContext
	 * @param {string} sSel
	 * @param {boolean} bWithSelf
	 * @param {boolean} bOnlyFirst
	 * @returns {Element[]}
	 */
	children( eContext, sSel, bWithSelf, bOnlyFirst ) {
		const bAddSelf = bWithSelf && eContext.matches( sSel );
		if( bOnlyFirst ) {
			if( bAddSelf ) {
				return [ eContext ];
			} else {
				const eRet = eContext.querySelector( sSel );
				if( eRet ) {
					return [ eRet ];
				} else {
					return [];
				}
			}
		} else {
			let aChildren = eContext.querySelectorAll( sSel );
			// NodeListOf<Element> => Element[]
			aChildren = Array.prototype.slice.call( aChildren );
			if( bAddSelf ) {
				return [ eContext, ...aChildren ];
			} else {
				return aChildren;
			}
		}
	}

	/**
	 * найти предков относительно переданого
	 * @param {Element} eContext
	 * @param {string} sSel
	 * @param {boolean} bWithSelf
	 * @param {boolean} bOnlyFirst
	 * @returns {Element[]}
	 */
	parents( eContext, sSel, bWithSelf, bOnlyFirst ) {
		let aRet = [];
		if( !bWithSelf ) {
			eContext = eContext.parentElement;
			if( !eContext ) {
				return [];
			}
		}
		let eClosest = eContext.closest( sSel );
		if( bOnlyFirst ) {
			if( eClosest ) {
				return [ eClosest ];
			} else {
				return [];
			}
		} else {
			while( eClosest ) {
				aRet.push( eClosest );
				eClosest = eClosest.parentElement.closest( sSel );
			}
			return aRet;
		}
	}

	/**
	 * по переданому DOM Element определяем id виджетов
	 * @param {Element} eContext
	 * @returns {String[]}
	 */
	parseBlockIds( eContext ) {
		let aRet = [];
		if( !eContext.classList ) {
			return aRet;
		}
		let i, iLen = eContext.classList.length, sClass;
		for( i = 0; i < iLen; i++ ) {
			sClass = eContext.classList[ i ];
			if( sClass === '_' || sClass.substr( 0, 1 ) !== '_' || sClass.indexOf( '-' ) !== -1 || sClass.indexOf( '_', 1 ) !== -1 ) {
				continue;
			}
			aRet.push( sClass.substr( 1 ) );
		}
		return aRet;
	}

	/**
	 * определение селектора для выбора
	 * всех блоков '._'
	 * конкретных блоков '._BlockId'
	 * конкретных элементов блоков '._BlockId-ElementId'
	 * @param {string} sBlockId
	 * @param {string} sElementId
	 * @returns {string}
	 */
	sel( sBlockId = '', sElementId = '' ) {
		let sRet = '._';
		if( sBlockId ) {
			sRet += sBlockId;
		}
		if( sElementId ) {
			sRet += '-' + sElementId;
		}
		return sRet;
	}
}
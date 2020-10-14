/**
 * разбор значений и конвертация типов из атрибутов Element
 * @implements IAttrs
 */
export class Attrs {

	/**
	 * @type function( oError: object ) :IError
	 */
	newError;

	/**
	 * @type {object} алиасы методов преобразования типа
	 */
	oCasts = {
		s: this._toStr,
		i: this._toInt,
		b: this._toBool,
		f: this._toFloat,
		mod: this._toMod,
		js: this._toJson,
		as: this._toArrayOfString
	};

	/**
	 * @type {string} префикс названия атрибута по умолчанию
	 */
	sPrefix = 'data-';

	/**
	 * @type {string} разделитель типа от значения по умолчанию
	 */
	sSep = ':';

	/**
	 * @type {string} тип по умолчанию
	 */
	sType = 's';

	/**
	 * @type {string} разделитель название X значение для mod типа
	 */
	sModSepVal = '=';

	/**
	 * @type {string} разделитель выражений для mod типа
	 */
	sModSepItem = ',';

	/**
	 * Разбор атрибутов
	 * @param {Element[]} aElements
	 * @param {string|string[]|object} mMap
	 * @param {string|null} sPrefix
	 * @return {{}}
	 */
	parse( aElements, mMap, sPrefix = null ) {
		const oRet = {};
		const aMap = this._parseMap( mMap );
		for( let iMapIndex = 0; iMapIndex < aMap.length; iMapIndex++ ) {
			const [ sAttr, sName, sType = this.sType ] = aMap[ iMapIndex ];
			for( let iElementIndex = 0; iElementIndex < aElements.length; iElementIndex++ ) {
				const eElement = aElements[ iElementIndex ];
				const sAttrName = ( sPrefix === null ? this.sPrefix : sPrefix ) + sAttr;
				if( !eElement.hasAttribute( sAttrName ) ) {
					continue;
				}
				const sAttrValue = eElement.getAttribute( sAttrName );
				oRet[ sName ] = this.oCasts[ sType ].call( this, sAttrValue );
				break;
			}
		}
		return oRet;
	}

	/**
	 * internal
	 * @param {string[]|string[][]|object} mMap
	 * @return {string[][]}
	 */
	_parseMap( mMap ) {
		const aRet = [];
		if( Array.isArray( mMap ) ) {
			for( let i = 0; i < mMap.length; i++ ) {
				const mMapItem = mMap[ i ];
				aRet.push( Array.isArray( mMapItem ) ? mMapItem : this._parseMapItem( mMapItem ) );
			}
		} else {
			for( let sFrom in mMap ) {
				const sMapItem = mMap[ sFrom ];
				aRet.push( this._parseMapItem( sMapItem, sFrom ) );
			}
		}
		return aRet;
	}

	/**
	 * internal
	 * sMapItem = "i:int", sFrom = null => [ "int", "int", 'i' ]
	 * sMapItem = "i:int", sFrom = "from" => [ "from", "int", 'i' ]
	 * sMapItem = "string", sFrom = null => [ "string", "string", 's' ]
	 * @param {string} sMapItem
	 * @param {string|null} sFrom
	 * @return {string[]}
	 */
	_parseMapItem( sMapItem, sFrom = null ) {
		const iSepPos = sMapItem.indexOf( this.sSep );
		let sTo, sType = this.sType;
		if( iSepPos === -1 ) {
			sTo = sMapItem;
		} else {
			sType = sMapItem.substr( 0, iSepPos );
			sTo = sMapItem.substr( iSepPos + 1 );
		}
		if( sFrom === null ) {
			sFrom = sTo;
		}
		if( !( sType in this.oCasts ) ) {
			throw this.newError( { message: 'Unknown attr cast ' + sMapItem, sHelp: 'unknown-attr-cast' } );
		}
		return [ sFrom, sTo, sType ];
	}

	_toStr( sValue ) {
		return sValue.trim();
	}

	_toBool( sValue ) {
		if( sValue === "0" ) {
			return false;
		}
		if( sValue === "1" ) {
			return true;
		}
		return !!sValue;
	}

	_toInt( sValue ) {
		const mVar = parseInt( sValue );
		if( isNaN( mVar ) ) {
			return 0;
		}
		return mVar;
	}

	_toFloat( sValue ) {
		const mVar = parseFloat( sValue );
		if( isNaN( mVar ) ) {
			return 0;
		}
		return mVar;
	}

	/**
	 * "one, two" => ['one', 'two']
	 */
	_toArrayOfString( sValue ) {
		const aRet = [];
		sValue.split( ',' ).forEach( ( sItem ) => {
			aRet.push( sItem.trim() );
		} );
		return aRet;
	}

	/**
	 * "1=one,2=two,3=three" => {"1": "one", "2": "two", "3": "three"}
	 */
	_toMod( sValue ) {
		if( sValue.indexOf( this.sModSepVal ) === -1 ) {
			sValue = this.sModSepVal + sValue;
		}
		const aValue = sValue.split( this.sModSepItem ), oRet = {};
		let i, sItem;
		for( i = 0; i < aValue.length; i++ ) {
			sItem = aValue[ i ];
			if( !sItem ) {
				continue;
			}
			let [ sMod, sClass ] = sItem.split( this.sModSepVal, 2 );
			oRet[ sMod ] = sClass;
		}
		return oRet;
	}

	_toJson( sValue ) {
		return JSON.parse( sValue );
	}
}
/**
 * по массиву или объекту ключей из всех источников собрать конечный объект
 * example:
 * deepKey( [ 'prop1', 'prop2' ], { prop1: 10 }, { prop2: 20 } ) =
 * { prop1: 10, prop2: 20 }
 * @param {Object|Array} mKeys
 * @param {...object} aSources
 */
export function deepKey( mKeys, ...aSources ) {
	const oRet = {};
	if( Array.isArray( mKeys ) ) {
		for( let i = 0; i < mKeys.length; i++ ) {
			deepKeyValue( oRet, aSources, mKeys[ i ], mKeys[ i ] );
		}
	} else {
		for( let i in mKeys ) {
			deepKeyValue( oRet, aSources, i, mKeys[ i ] );
		}
	}
	return oRet;
}

function deepKeyValue( oRet, aSources, sKeyFrom, sKeyTo ) {
	for( let i = 0; i < aSources.length; i++ ) {
		let oSource = aSources[ i ];
		if( oSource.hasOwnProperty( sKeyFrom ) && typeof oSource[ sKeyFrom ] !== 'undefined' ) {
			oRet[ sKeyTo ] = oSource[ sKeyFrom ];
		}
	}
}
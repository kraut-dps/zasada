export function mergeDeep( oTarget, oSource ) {
	for( const mKey in oSource ) {
		if( _isObject( oSource[mKey] ) ) {
			if( !oTarget[mKey] ) {
				oTarget[ mKey ] = {};
			}
			mergeDeep( oTarget[mKey], oSource[mKey] );
		} else {
			oTarget[ mKey ] = oSource[ mKey ];
		}
	}
}

function _isObject( mItem ) {
	return ( mItem && typeof mItem === 'object' && !Array.isArray( mItem ) );
}
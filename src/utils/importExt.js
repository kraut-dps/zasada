export function importExt( sUrl, fnResolve, fnReject ) {
	const hExecutor = ( fnResolve, fnReject ) => {
		const eScript = document.createElement( "script" );
		eScript.src = sUrl;
		eScript.type = 'text/javascript';
		eScript.onload = fnResolve;
		eScript.onerror = fnReject;
		eScript.async = true;
		document.body.appendChild( eScript );
	};
	if( fnResolve ) {
		hExecutor( fnResolve, fnReject );
	} else {
		return new Promise( hExecutor );
	}
}
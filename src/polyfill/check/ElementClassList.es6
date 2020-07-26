let bCheck = true;
try {
	const eTest = document.createElement( "_" ), sClass = 'c';
	eTest.classList.toggle( sClass, false );
	if ( eTest.classList.contains( sClass ) ) {
		throw 1;
	}
} catch( e ) {
	bCheck = false;
}
export { bCheck };
export class HistoryAdapter {

	isEnabled() {
		return !!history.pushState;
	}

	pushState( ...aArgs ) {
		// @ts-ignore
		history.pushState( ...aArgs );
	}

	replaceState( ...aArgs ) {
		// @ts-ignore
		history.replaceState( ...aArgs );
	}

	onPopState( fnHandler ) {
		window.addEventListener( 'popstate', fnHandler );
	}
}
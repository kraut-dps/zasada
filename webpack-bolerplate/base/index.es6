import {MainBox} from "zasada/src/MainBox.es6";
import {HelloWorld} from "widget/HelloWorld.es6";

const oApp = new MainBox();
const oLinker = oApp.oneCoreBox().oneLinker();
oLinker.setWidgets( {
	HelloWorld
} );
oLinker.setImports( {
	"google-maps": () => {
		return new Promise( ( fnResolve ) => {
			window.gmLoad = () => {
				fnResolve( google.maps );
			}
			oApp.importExt( "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2czs4_E-IKuah-6umlFETXsnFZr25qiI&callback=gmLoad" );
		} );
	}
} );
oLinker.setBeforeNew(
	[
		'HelloWorldLazy',
		'Map'
	], () => {
		return import( /* webpackChunkName: "lazy-widgets" */ 'lazy-widgets.es6' ).then( ( oWidgets ) => {
			oLinker.setWidgets( oWidgets );
		} );
	}
);
export {oApp};
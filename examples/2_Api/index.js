import {RootBox} from "zasada/src/index.js";
import oDeps from "zasada/src/deps.js";

import {ApiWidget} from "./ApiWidget.js";
import {TestWidget} from "./TestWidget.js";
import {OtherWidget} from "./OtherWidget.js";


const oRootBox = new RootBox( oDeps );
const oCoreBox = oRootBox.box( 'core' );
oCoreBox.polyfills( () => {
	const oLinker = oCoreBox.oneLinker();
	oLinker.setWidgets( {
		ApiWidget,
		TestWidget,
		OtherWidget
	} );
	oLinker.link( document );
} );
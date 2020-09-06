import {RootBox} from "di-box";
import oDeps from "zasada/src/deps.js";

import {ApiWidget} from "./ApiWidget.js";
import {TestWidget} from "./TestWidget.js";
import {OtherWidget} from "./OtherWidget.js";


const oRootBox = new RootBox( oDeps );
oRootBox.box( 'core' ).init( ( oLinker ) => {
	oLinker.setWidgets( {
		ApiWidget,
		TestWidget,
		OtherWidget
	} );
	oLinker.link( document );
} );
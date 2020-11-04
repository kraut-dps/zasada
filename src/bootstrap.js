/// <reference path="utils/interfaces.d.ts"/>
import oCore, {_Box as CoreBox} from "./core/index.js";
import /*oLog,*/ {_Box as LogBox} from "../packages/log/src";
import {box} from "./box.js";

/**
 * @module greeter
 */
class yo {
	callee
	length

	error( oLog ) {
	}

	[Symbol.iterator]() {
		return undefined;
	}
}

export default function( fnInit ) {
	const oRoot = {};
	oRoot.log = box( LogBox, {
		Logger: yo
	} );
	oRoot.core = box( CoreBox, {...oCore, newError: oRoot.log.newError} );
	oRoot.log.init();
	oRoot.core.init( ( oLinker ) => {
		fnInit( oRoot, oLinker );
		oLinker.link( document );
	} );
}
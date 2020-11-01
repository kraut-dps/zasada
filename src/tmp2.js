import oLog, {LogBox} from "./help.js";
import oCore, {CoreBox} from "./help.js";
import oBrigada, {BrigadaBox} from "./help.js";
import oHelper from "./help.js";
const oRoot = {};
oRoot.log = oHelper.box( LogBox, oLog );
oRoot.core = oHelper.box( CoreBox, { ...oCore, newError: oRoot.log.newError } );
oRoot.brigada = oHelper.box( BrigadaBox, { ...oBrigada, oneLinker: oRoot.core.oneLinker } );
oRoot.log.init();
oRoot.core.init( ( oLinker ) => {
    oRoot.brigada.init();
    fnConfig( oRoot, oLinker );
    oLinker.link( document );
} );
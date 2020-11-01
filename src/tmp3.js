import oCore, {_Box as CoreBox} from "./core/index.js";
import {box} from "./box.js";
const oRoot = {};
//oRoot.core = box( CoreBox, { ...oCore, newError: oRoot.log.newError } );
oRoot.core = box(
    CoreBox,
    oCore
);
//oRoot.log.init();
oRoot.core.init( ( oLinker ) => {
   // oRoot.brigada.init();
    fnConfig( oRoot, oLinker );
    oLinker.link( document );
} );
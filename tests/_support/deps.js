import oDeps from "zasada/src/deps.js";
import {fnRel} from "di-box";
import {TestBox} from "zasada/src/test/TestBox.js";
import {Helper} from "zasada/src/test/Helper.js";

oDeps.test = {
	_Box: TestBox,
	oneLinker: fnRel( 'core' ),
	Helper
};

export default oDeps;
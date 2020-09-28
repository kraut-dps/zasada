import oDeps from "zasada/src/deps.js";
import {TestBox} from "zasada/src/test/TestBox.js";
import {Helper} from "zasada/src/test/Helper.js";

oDeps.test = {
	_Box: TestBox,
	"&oneLinker": "core",
	Helper
};

export default oDeps;
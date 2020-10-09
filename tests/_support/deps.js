import oDeps from "./../../src/deps.js";
import {TestBox} from "./../../src/test/TestBox.js";
import {Helper} from "./../../src/test/Helper.js";

oDeps.test = {
	_Box: TestBox,
	"&oneLinker": "core",
	Helper
};

export default oDeps;
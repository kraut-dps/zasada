import oDeps from "./../../src/deps.js";
import {TestBox} from "../../packages/test/src/TestBox.js";
import {Helper} from "../../packages/test/src/Helper.js";

oDeps.test = {
	_Box: TestBox,
	"&oneLinker": "core",
	Helper
};

export default oDeps;
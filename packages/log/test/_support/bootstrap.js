import oLogBox from "../../src/index.js";
import oCoreBox from "../../../core/src/index.js";
import oTestBox from "../../../test/src/index.js";
export {Widget} from "../../../widget/src/Widget.js";

oCoreBox.newError = oLogBox.newError;
oTestBox.oneLinker = oCoreBox.oneLinker;
const oRoot = {
  log: oLogBox,
  core: oCoreBox,
  test: oTestBox
};
oRoot.log.init();
export {oRoot as default};
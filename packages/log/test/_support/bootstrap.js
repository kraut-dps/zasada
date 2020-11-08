import oLogBox from "../../src/index.js";
import oCoreBox from "@zasada/core";
import oTestBox from "@zasada/test";
export {Widget} from "@zasada/widget";

oCoreBox.newError = oLogBox.newError;
oTestBox.oneLinker = oCoreBox.oneLinker;
const oRoot = {
  log: oLogBox,
  core: oCoreBox,
  test: oTestBox
};
oRoot.log.init();
export {oRoot as default};
import oCoreBox from "../../src/index.js";
import oTestBox from "../../../test/src/index.js";
export {Widget} from "../../../widget/src/Widget.js";

oTestBox.oneLinker = oCoreBox.oneLinker;
const oRoot = {
  core: oCoreBox,
  test: oTestBox
};
export {oRoot as default};
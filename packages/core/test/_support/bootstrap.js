import oCoreBox from "../../src/index.js";
import oTestBox from "@zasada/test";
export  {Widget} from "@zasada/widget";

oTestBox.oneLinker = oCoreBox.oneLinker;
const oRoot = {
  core: oCoreBox,
  test: oTestBox
};
export {oRoot as default};
import {TestBox} from "./TestBox.js";
import {Helper} from "./Helper.js";

const oBox = new TestBox();
oBox.Helper = Helper;
export { oBox as default };
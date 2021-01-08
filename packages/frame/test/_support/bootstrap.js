import oRoot from "@zasada/bootstrap/src/core-log-test.js";
import oFrameBox from "../../src/index.js";
oFrameBox.oneLinker = oRoot.core.oneLinker;
oFrameBox.oneStorage = oRoot.core.oneStorage;
oFrameBox.newRelQuery = oRoot.core.newRelQuery;
oRoot.frame = oFrameBox;

export {oRoot as default};
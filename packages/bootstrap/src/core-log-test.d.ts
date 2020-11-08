import {LogBox} from "@zasada/log/types/LogBox";
import {CoreBox} from "@zasada/core/types/CoreBox";
import {TestBox} from "@zasada/test/types/TestBox";

interface IRoot {
  log: LogBox;
  core: CoreBox;
  test: TestBox;
}
declare var oRoot: IRoot;
export { oRoot as default };

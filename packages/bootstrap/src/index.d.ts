import {LogBox} from "@zasada/log/types/LogBox";
import {CoreBox} from "@zasada/core/types/CoreBox";

interface IRoot {
  log: LogBox;
  core: CoreBox;
}
declare var oRoot: IRoot;
export { oRoot as default };

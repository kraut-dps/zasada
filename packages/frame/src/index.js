import { FrameBox } from "./FrameBox.js";
import { Area } from "./widget/Area.js";
import { Btn } from "./widget/Btn.js";
import { Frame } from "./widget/Frame.js";
import { Form } from "./widget/Form.js";
import { FormField } from "./widget/FormField.js";
import { History } from "./widget/History.js";
import { HistoryAdapter } from "./class/HistoryAdapter.js";

import { Layers } from "./widget/Layers.js";
import { Layer } from "./widget/Layer.js";
import { RemoteValidator } from "./class/RemoteValidator.js";
import { Request } from "./class/Request.js";
import { deepKey } from "@zasada/core/src/utils/deepKey.js";

const oBox = new FrameBox();
oBox.Area = Area;
oBox.Btn = Btn;
oBox.Frame = Frame;
oBox.Form = Form;
oBox.FormField = FormField;
oBox.History = History;
oBox.HistoryAdapter = HistoryAdapter;
oBox.Layers = Layers;
oBox.Layer = Layer;
oBox.RemoteValidator = RemoteValidator;
oBox.Request = Request;
oBox.deepKey = deepKey;
export { oBox as default };

//"&oneStorage": "core",
//	"&oneLinker": "core",
//	"&newRelQuery": "core"

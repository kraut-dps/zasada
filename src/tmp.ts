import {constructor, help, IAttr} from "./help.js";


class Attr1 implements IAttr{
    do(): void {
        console.log(1);
    }

}
class Attr2{

}

class Box1{
    Attr1: constructor<IAttr>;
}

const oHelp = new help();
oHelp.boxHelp(
    Box1,
    {
        Attr1: Attr1
    }
);
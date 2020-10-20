import {constructor, help} from "./help.js";

/**
 * @implements IAttr
 */
class Attr1{
    do() {
        console.log(1);
    }

}
class Attr2{

}

class Box1{
    /**
     * @type {IAttr}
     */
    Attr1;
}

const oHelp = new help();
oHelp.boxHelp(
    Box1,
    {
        Attr1: Attr2
    }
);
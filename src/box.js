export function box( mBox, oBoxProps ) {
    const oBox = new mBox();
    Object.assign( oBox, oBoxProps );
    return oBox;
}
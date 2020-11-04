
export function box( mBox, oBoxProps ) {
    const oBox = !( mBox instanceof Box ) ? new mBox() : mBox;
    Object.assign( oBox, oBoxProps );
    return oBox;
}
import {Box} from "zasada/src/utils/Box.js";

export class RootBox extends Box {

	/**
	 * @type {{}} объект для хранения зависимостей
	 */
	oOpts = {};

	_oOne = {};

	constructor( oOpts ) {
		super();
		this.oOpts = oOpts;
	}

	box( sName ) {
		if ( !this._oOne[sName] ) {
			const { _Box, _fnRel, ...oDeps } = this.oOpts[sName];

			const oBox = new _Box();

			Object.assign( oBox, oDeps );

			if( _fnRel ) {
				_fnRel( this, oBox );
			}

			this._assertUndefProps( oBox );

			this._oOne[sName] = oBox;
		}
		return this._oOne[sName];
	}
}
import {Box} from "zasada/src/utils/Box.js";

export class RootBox extends Box {

	/**
	 * @type {{}} объект для хранения зависимостей
	 */
	oDeps = {};

	_oOne = {};

	_aPrefix = [ 'one', 'new' ];

	constructor( oDeps ) {
		super();
		this.oDeps = oDeps;
	}

	box( sName ) {
		if ( !this._oOne[sName] ) {
			const oDeps = this.oDeps[sName];
			const oBox = new oDeps.Box();
			for ( let sDep in oDeps ) {

				if ( sDep === 'Box' ) {
					continue;
				}

				// если функция, выполняем ее из контекста Root
				if( typeof oDeps[ sDep ] === 'function' && this._aPrefix.indexOf( sDep.substr( 0, 3 ) ) !== -1 ) {
					oBox[sDep] = oDeps[sDep].bind( this );
					continue;
				}

				oBox[sDep] = oDeps[sDep];
			}
			this._assertUndefProps( oBox );
			this._oOne[sName] = oBox;
		}
		return this._oOne[sName];
	}
}

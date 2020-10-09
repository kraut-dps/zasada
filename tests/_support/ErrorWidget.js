import {Widget} from "../../src/index.js";

export class ErrorWidget extends Widget {

	static TYPE_ERROR = 1;
	static TYPE_COMPAT = 2;
	static TYPE_STRING = 3;
	static TYPE_REL_FROM_BAD = 4;

	iType = ErrorWidget.TYPE_ERROR;

	run() {

		this._my( { 'type': 'i:iType' } );

		switch( this.iType ) {
			case ErrorWidget.TYPE_ERROR:
				throw new Error( 'error origin' );
			case ErrorWidget.TYPE_COMPAT:
				throw { message: 'error object', sourceURL: 'sourceURL', line: 'line' };
			case ErrorWidget.TYPE_STRING:
				throw 'error string';
			case ErrorWidget.TYPE_REL_FROM_BAD:
				this._rel().from( 'bad' ).find();
		}
	}
}
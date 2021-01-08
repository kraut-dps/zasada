/**
 * виджет, автоматической обработки a тегов как Btn виджетов
 */
import {Widget} from "@zasada/widget";

/**
 * @typedef {import('./../interfaces').IRequest} IRequest
 */

export class Area extends Widget{

	/**
	 * @type {function():IRequest}
	 */
	oneRequest;

	oDefaultOpts = {};

	/**
	 * @type {string} если режим area, какой css match обрабатываем?
	 */
	sMatch = 'a';

	run() {
		this._on( '', 'click', this._onClick.bind(this) );
	}

	_onClick( oEvent ) {
		const eTarget = oEvent.target;
		let eBtn;
		if ( !eTarget.matches( this.sMatch ) ) {
			if ( !eTarget.matches( this.sMatch + ' *' ) ) {
				return true;
			} else {
				eBtn = eTarget.closest( this.sMatch );
			}
		} else {
			eBtn = eTarget;
		}

		// отличные от обычного клика ситуации
		if( oEvent.which > 1 || oEvent.metaKey || oEvent.ctrlKey || oEvent.shiftKey || oEvent.altKey ) {
			return true;
		}

		// клик по внешним ссылкам
		if( ( eBtn.protocol && location.protocol !== eBtn.protocol ) || ( eBtn.hostname && location.hostname !== eBtn.hostname ) ) {
			return true;
		}

		//if ( link.href.indexOf('#') > -1 && stripHash(link) == stripHash(location) )
		//	return

		// там где событие уже остановлено, ничего не делаем
		if( oEvent.defaultPrevented ) {
			return true;
		}

		oEvent.preventDefault();

		this._exec( eBtn, oEvent );
	}

	_exec( eBtn, oEvent ) {
		const oOpts = this._parseOpts( eBtn, oEvent );
		this.oneRequest().exec( oOpts, 'disabled', 'confirm', 'urlBlank', 'layer', 'frame', 'win' );
	}

	_parseOpts( eBtn, oEvent ) {
		const aSources = [];
		aSources.push( eBtn );
		if( eBtn !== this.bl() ) {
			aSources.push( this.bl() );
		}
		return { ...this.oDefaultOpts, ...this._attrs( aSources, this.oneRequest().optsMap(), '' ), eBtn, oEvent };
	}
}
/**
 * кнопка, определяет какие данные в каком фрейме показать, по смыслу <a>
 * c дополнительными возможностями
 * варианты:
 * 1. Cам блок слушает onclick
 * <div class="_ _Btn">кнопка</div>
 * 2. Отдльные элементы Btn слушают onclick, сам блок только настройки
 * <div class="_ _Btn">
 *   <div class="_Btn-Btn">кнопка1</div>
 *   <div class="_Btn-Btn">кнопка2</div>
 * </div>
 * 3. Отдельный элемент Area все элементы которого слушают onclick
 * <div class="_ _Btn _Btn-Area">
 *   <a href="url1">кнопка1</a>
 *   <a href="url2">кнопка2</a>
 * </div>
 *
 * атрибуты
 * data-url или href Url для перехода
 * data-confirm - текст подтверждения window.confirm
 * data-post="1" - отправлять HTTP методом POST
 * data-form="1" - параметры запроса взять из формы, onclick должен срабатывать на элементе формы
 * data-frame-id или target - id фрейма, в котором отобразим контент
 * data-scroll="1" - нужно ли делать scrollTop после обновления страницы?
 */
import {Widget} from "@zasada/widget";

/**
 * @typedef {import('./../interfaces').IRequest} IRequest
 */

export class Btn extends Widget{

	/**
	 * @var {function():IRequest}
	 */
	oneRequest;

	oDefaultOpts = {};

	run() {
		// @ts-ignore
		if( this._el( 'Btn[]?' ).length ) {
			this._on( 'Btn[]?', 'click', this._onClick.bind(this) );
		} else {
			this._on( this.bl(), 'click', this._onClick.bind(this) );
		}
	}

	_onClick( oEvent ) {
		oEvent.preventDefault();
		this._exec( oEvent.currentTarget, oEvent );
	}

	_exec( eBtn, oEvent ) {
		this.oneRequest().exec(
			this._parseOpts( eBtn, oEvent ),
			'disabled',
			'confirm',
			'urlBlank',
			'layer',
			'frame',
			'win'
		);
	}

	_parseOpts( eBtn, oEvent ) {
		const aSources = [];
		aSources.push( eBtn );
		if( eBtn !== this.bl() ) {
			aSources.push( this.bl() );
		}
		const oOpts = { ...this.oDefaultOpts, ...this._attrs( aSources, this.oneRequest().optsMap(), '' ), eBtn, oEvent };
		if( this._el( 'Content?' ) ) {
			// @ts-ignore
			oOpts.sContent = this._el( 'Content?' ).innerHTML;
		}
		return oOpts;
	}
}
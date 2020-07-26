import {Widget} from "zasada/src/Widget.es6";

export class Map extends Widget {

	async run() {
		const { fLat, fLng } = this._attr( { lat: "f:fLat", lng: "f:fLng" } );
		const oGoogleMaps = await this._import( 'google-maps' );
		new oGoogleMaps.Map( this.bl(), {
			center: {
				lat: fLat,
				lng: fLng
			},
			zoom: 8
		});
	}
}
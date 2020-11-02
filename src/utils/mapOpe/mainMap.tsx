require('@supermap/iclient-leaflet');
import L from "leaflet";

export const initMap = () => {
    var url = 'https://iserver.supermap.io/iserver/services/map-world/rest/maps/World';
    var map = L.map('map', {
        crs: L.CRS.EPSG4326,
        center: [0, 0],
        maxZoom: 18,
        zoom: 1
    });
    // L.supermap.tiledMapLayer(url).addTo(map);
}
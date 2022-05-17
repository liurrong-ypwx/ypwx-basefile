
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import * as control from "ol/control";
const superMapOl = require("@supermap/iclient-ol");
const mapping = require("@supermap/iclient-ol/mapping");

// 初始化地图
export const initMap = (domID: string) => {
    // const map = new Map({
    //     target: domID,
    //     controls: control.defaults({ attributionOptions: { collapsed: true } }),
    //     view: new View({
    //         center: [0, 0],
    //         zoom: 2,
    //         // projection: 'EPSG:4326'
    //     })
    // })
    // return map;
}

// 添加supermap iserver发布的地图
export const addBaseMapSuper = (orgMap: any, orgUrl: string) => {
    const layer = new TileLayer({
        source: new superMapOl.TileSuperMapRest({
            url: orgUrl,
            wrapX: true
        })
    })
    orgMap.addLayer(layer);
}

// 添加天地图
export const addBaseMapTdt = (orgMap: any) => {
    const layer = new TileLayer({
        source: new mapping.Tianditu({
            layerType: 'ter',
            key: "1d109683f4d84198e37a38c442d68311",
            projection: "EPSG:4326"
        })
    })
    orgMap.addLayer(layer);
}


// 添加比例尺
export const addScale = (orgMap: any) => {
    const scaleControl = new control.ScaleLine();
    orgMap.addControl(scaleControl);
}

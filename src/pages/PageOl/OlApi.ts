import Map from 'ol/Map';
// import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import { transform } from "ol/proj"
import Point from "ol/geom/Point";
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Vector from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';


export interface ITdtProject {
    type: string,
    remark: string,
}
export interface ITdtLayerDef {
    type: string,
    url: string,
    remark: string,
    token?: string,
}

export const TdtProject = {
    "EPSG:4490": {
        type: "EPSG:4490",
        remark: "经纬度投影"
    },
    "EPSG:3857": {
        type: "EPSG:3857",
        remark: "球面墨卡托投影"
    }
}

export enum TdtUrlType {
    "vec_c",
    "vec_w",
    "cva_c",
    "cva_w",
    "img_c",
    "img_w",
    "cia_c",
    "cia_w",
    "ter_c",
    "ter_w",
    "cta_c",
    "cta_w"
}
export const TdtUrl = {

}

// 2022-05-17 粉刷匠 初始化openlayer地图
export const initOlMap = (id: string, viewOption: any) => {
    const mapOrg = new Map({
        target: id,
        view: new View({
            center: transform([121.455629, 28.65162], 'EPSG:4326', 'EPSG:3857'),
            zoom: 18,
            ...viewOption,
        }),
    });
    return mapOrg;
}

// 2022-05-17 粉刷匠 添加天地图
export const addTdtLayer = (map: any, url: string) => {
    const tian_di_tu_road_layer = new TileLayer({
        source: new XYZ({
            url: url,
            projection: "EPSG:4326"
        }),
    });
    map.addLayer(tian_di_tu_road_layer);
}

// 2022-05-17 粉刷匠 添加geoserver地图服务
export const addGeoserverLayer = (map: any, url: string, paramsOption: any) => {
    const pipeLayer = new TileLayer({
        source: new TileWMS({
            url: 'https://www.jj-zhps.cn/geoserver/jiaojiang/wms',
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                tiled: true,
                "LAYERS": 'jiaojiang:ST_PS_PIPE_ZY',//tiger--图层的名称空间，poi--图层名称
                "exceptions": 'application/vnd.ogc.se_inimage',
            },
            serverType: 'geoserver',//服务类型geoerver
            crossOrigin: 'anonymous',
            projection: "EPSG:4326"
        })
    })

    map.addLayer(pipeLayer);
}

// 2022-05-17 粉刷匠 添加图标点
export const addOlIcon = (map: any, data: any) => {
    const featureArr = [];
    for (let i = 0; i < data.length; i++) {
        const lonlat = data[i].cord;
        const tip = data[i].tooltip;
        const point = new Point(transform(lonlat, 'EPSG:4326', 'EPSG:3857'));
        const pointFeature = new Feature(point);
        pointFeature.setStyle(
            new Style({
                image: new Icon({
                    anchor: [0.5, 0.5],
                    crossOrigin: 'anonymous',
                    src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
                }),
                text: new Text({
                    text: tip,
                    scale: 1.3,
                    fill: new Fill({
                        color: '#000000'
                    }),
                    stroke: new Stroke({
                        color: '#FFFF99',
                        width: 3.5
                    })
                })
            })
        );
        featureArr.push(pointFeature)
    }



    // vectorSource.addFeature(pointFeature);


    const vectorSource = new Vector({
        features: featureArr
    });

    const layer = new VectorLayer({
        source: vectorSource
    });

    map.addLayer(layer);
}


// 2022-05-17 粉刷匠 地图hover事件
let overall_lastfeature: any = null;
export const addOlMapMouseMove = (map: any) => {

    // 鼠标移入显示坐标
    // map.addControl(new OpenLayers.Control.MousePosition())
    // 鼠标移入显示手指
    // map.layerContainerDiv.style.cursor = "pointer";

    map.on('pointermove', function (e: any) {
        const pixel = map.getEventPixel(e.originalEvent);
        const hit = map.hasFeatureAtPixel(pixel);
        // =====获取到当前像素下的feature
        const feature = map.forEachFeatureAtPixel(pixel, function (feature: any, layer: any) {
            return feature;
        });
        // =====如果当前图层是指定的类型就标注为可点击状态
        if (feature !== null && typeof (feature) !== "undefined") {
            map.getTargetElement().style.cursor = hit ? 'pointer' : '';


            // if (feature.get("type") === "click_stationPoint") {
            //     // =====这里的overall_lastfeature是全局变量，对当前符合条件的feature赋值给这个全局变量方便后面做移出事件
            //     overall_lastfeature = feature;
            //     // =====这里写自己鼠标移入时的样式或鼠标移入时的其他操作

            //     //=====设置为手型表明可点击
            //     map.getTargetElement().style.cursor = hit ? 'pointer' : '';
            // } else {
            //     map.getTargetElement().style.cursor = hit ? '' : '';
            // }
        } else {
            // =====敲黑板，划重点！！！！！这个overall_lastfeature是定义的一个全局变量，因为这里的判断是鼠标在地图上移动都会触发这里，鼠标移入你指定的feature时会在上面的判断做相应的操作，鼠标移除后就会触发这里，所以就有了这个overall_lastfeature作为全局变量，在这里做移出操作，
            if (overall_lastfeature !== "" && overall_lastfeature !== null) {
                // overall_lastfeature.dispatchEvent({ "type": 'mousein', "event": event });
            }
            map.getTargetElement().style.cursor = hit ? '' : '';
        }
    });

}
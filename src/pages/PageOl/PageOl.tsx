import React, { useEffect, useState } from "react";
import "./PageOl.less";

import 'ol/ol.css';
// import Map from 'ol/Map';
// import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
// import View from 'ol/View';
// import XYZ from 'ol/source/XYZ';
// import { transform } from "ol/proj"
import { addOlIcon, addOlMapMouseMove, addTdtLayer, initOlMap } from "./OlApi";


function PageOl(props: any): JSX.Element {
    const mapID = "OL-ID";
    const [map, setMap] = useState<any>(null);

    useEffect(() => {
        initMap();
    }, [])

    const initMap = () => {
        const mapOrg = initOlMap(mapID, {});
        setMap(mapOrg);
    }

    useEffect(() => {
        if (map) {
            addOlMapMouseMove(map);
            addTdtBaseMap();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map])

    const addTdtBaseMap = () => {

        const urlTdt = "http://t0.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
            "&LAYER=vec&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}" +
            "&style=default&format=tiles&tk=077b9a921d8b7e0fa268c3e9146eb373";
        const urlTdtLabel = "http://t0.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
            "&LAYER=vec&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}" +
            "&style=default&format=tiles&tk=077b9a921d8b7e0fa268c3e9146eb373";

        addTdtLayer(map, urlTdt);
        addTdtLayer(map, urlTdtLabel);


        // 添加geoserver 发布的地图服务
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


        const dataArr = [
            { cord: [121.453429, 28.65162], tooltip: "这是1" },
            { cord: [121.454529, 28.65162], tooltip: "这是2" },
            { cord: [121.455629, 28.65162], tooltip: "这是3" },
            { cord: [121.456429, 28.65162], tooltip: "这是4" },
            { cord: [121.457429, 28.65162], tooltip: "这是5" },
        ]
        addOlIcon(map, dataArr);



    }

    // document.getElementById('zoom-out').onclick = function () {
    //     const view = map.getView();
    //     const zoom = view.getZoom();
    //     view.setZoom(zoom - 1);
    // };

    // document.getElementById('zoom-in').onclick = function () {
    //     const view = map.getView();
    //     const zoom = view.getZoom();
    //     view.setZoom(zoom + 1);
    // };



    return (
        <div className="pageol">
            <div className="OL-ID" id={mapID} />
        </div>
    )
}

export default PageOl;
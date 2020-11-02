import React, { useEffect } from "react";
import "./OpenLayer.less";


function OpenLayerDemo(): JSX.Element {
    
    useEffect(()=>{
        const L: any = window.SPL;
        debugger;
        if(!L) return
        

        const url ="https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
       
        // 初始化地图信息
        const map = L.map('map', {
            crs: L.CRS.NonEarthCRS({
                bounds: L.bounds([48.4, -7668.25],[8958.85, -55.58]),
                origin: L.point(48.4,-55.58)
            }),
            center: [-4500, 4000],
            maxZoom: 18,
            zoom: 1
        });
        // 添加图层
        L.supermap.tiledMapLayer(url, {noWrap: true}).addTo(map);
    }, [])

    return (
        <div>
            hello OpenLayerDemo
            <div id="map" style={{ position: "absolute", left: 0, right: 20, width: 800, height: 500 }}></div>
        </div>
    )
}

export default OpenLayerDemo;
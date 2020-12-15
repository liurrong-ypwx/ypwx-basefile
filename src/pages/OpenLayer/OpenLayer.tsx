import React, { useEffect, useState } from "react";
import "./OpenLayer.less";
import * as mapApi from "../../utils/mapOpe/mainMap";


function OpenLayerDemo(): JSX.Element {

    const [map, setMap] = useState<any>(null);

    useEffect(() => {
        setTimeout(() => {
            initMap();
        }, 500);
        // eslint-disable-next-line
    }, [])

    const initMap=()=>{
        if(map){
            map.off();
            map.remove();
        }
        // const url = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
        const tmpMap = mapApi.initMap("map");
        // mapApi.addBaseMapSuper(tmpMap, url);
        mapApi.addBaseMapTdt(tmpMap);
        mapApi.addScale(tmpMap);
        setMap(tmpMap);
    }

    return (
        <div className="open-layer-page">
            <div id="map" className="map-container" />
        </div>
    )
}

export default OpenLayerDemo;
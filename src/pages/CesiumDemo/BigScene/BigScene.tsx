import React, { useEffect, useState } from "react";
import "./BigScene.less";
import * as CesiumApi from "./util/CesiumApi";

function BigScene(props: any): JSX.Element {
    const mapId = "ID_BIG_SCENE";
    const [view, setView] = useState<any>(null);

    useEffect(() => {
        const tmpView = CesiumApi.initMap(mapId);
        setView(tmpView);
    }, []);

    useEffect(() => {
        if (!view) return;
        CesiumApi.addTdt(view);
        CesiumApi.zoomPipe(view);
        CesiumApi.addPipe(view);
        // CesiumApi.zoomToShenzhen(view); 
        // CesiumApi.addPolylineVolume(view);
        // CesiumApi.addMutTypeLine(view);
        // CesiumApi.zoomToPara(view, {lng: 114.167, lat: 22.67, height: 1300.0})
        // CesiumApi.addShenzhenBuilding3Dtile(view);
        // CesiumApi.addFuseEchartGraphic(view);

    }, [view])

    return (
        <div className="big-scene">
            <div id={mapId} className="big-scene-map-container" />
           
        </div>
    )
}
export default BigScene;
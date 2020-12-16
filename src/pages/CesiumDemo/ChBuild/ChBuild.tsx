import React, { useEffect, useState } from "react";
import "./ChBuild.less";
import * as CesiumApi from "../../../utils/CesiumApi/CesiumApi";


function ChBuild(): JSX.Element {

    const [orgView, setOrgView] = useState<any>(null);

    useEffect(() => {
        const tmpView = CesiumApi.initMap("cesiumContainer", true);
        // CesiumApi.addBuilding(tmpView, "");
        setOrgView(tmpView);
    }, [])

    useEffect(()=>{

        if(!orgView) return
    

    }, [orgView])

    return (
        <div className="main-map-container">
            {/* 初始化一个框来放置场景 */}
            <div id='cesiumContainer' />
            <button id="toggle-building" style={{ position: "fixed", zIndex: 1, top: 5, left: 5 }}>TOGGLE NEW BUILDINGS</button>
        </div>
    )
}

export default ChBuild;
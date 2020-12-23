import React, { useEffect, useState } from "react";
import "./ChBuild.less";
import * as CesiumApi from "../../../utils/CesiumApi/CesiumApi";


function ChBuild(): JSX.Element {

    const [orgView, setOrgView] = useState<any>(null);

    useEffect(() => {
        const tmpView = CesiumApi.initMap("cesiumContainer", false);
        // CesiumApi.addBuilding(tmpView, "");
        setOrgView(tmpView);
    }, [])

    useEffect(()=>{

        if(!orgView) return
    

    }, [orgView])

    // 添加点线面
    const handleAddGeometry = (type: string) => {
        if (!orgView) return;
        CesiumApi.addCustomGeometry(orgView, type);
    }

    // 重置地图
    const setDedaultExtent = () => {
        if (!orgView) return;
        CesiumApi.setExtent(orgView);
    }
   

    return (
        <div className="main-map-container">
            {/* 初始化一个框来放置场景 */}
            <div id='cesiumContainer' />

            {/* 按钮区 */}
            <div className="test-btn-group">
                <div className="sig-btn" onClick={() => { setDedaultExtent() }} >重置</div>
                <div className="sig-btn" onClick={() => { handleAddGeometry("Point") }} >添加标注</div>
                <div className="sig-btn" onClick={() => { handleAddGeometry("Polyline") }} >添加Polyline</div>
                <div className="sig-btn" onClick={() => { handleAddGeometry("Polygon") }} >添加Polygon</div>
            </div>
        </div>
    )
}

export default ChBuild;
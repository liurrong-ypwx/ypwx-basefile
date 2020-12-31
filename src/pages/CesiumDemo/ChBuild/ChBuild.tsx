import React, { useEffect, useState } from "react";
import "./ChBuild.less";
import * as CesiumApi from "../../../utils/CesiumApi/CesiumApi";
import { titleList } from "./TuCao";


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

    // 测量距离 or 面积
    const handleMeasure = (type: string) => {
        if (!orgView) return;
        CesiumApi.addMeasureTool(orgView, type);
    }

    // 重置地图
    const setDedaultExtent = () => {
        if (!orgView) return;
        CesiumApi.setExtent(orgView);
    }

    // 测试飞行路线
    const testFly = () => {
        if (!orgView) return;
        CesiumApi.addTestFlightLine(orgView);
    }

    // 获取相机飞行参数
    const getPara = () => {
        if (!orgView) return;
        CesiumApi.getTestCameraPara(orgView);
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
                <div className="sig-btn" onClick={() => { handleMeasure("distance") }} >测距</div>
                <div className="sig-btn" onClick={() => { handleMeasure("area") }} >测面积</div>
                <div className="sig-btn" onClick={() => { getPara() }} >获取相机参数</div>
                <div className="sig-btn" onClick={() => { testFly() }} title={titleList.testFly} >飞行</div>
            </div>
        </div>
    )
}

export default ChBuild;
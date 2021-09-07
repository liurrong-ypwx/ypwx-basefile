import React, { useEffect, useState } from "react";
import "./JdyDemo.less";
import * as CesiumApi from "./JdyCesiumApi";

let isUseArcgis = false;
function JdyDemo(): JSX.Element {
    const id = "jdyCesiumContainer";
    const [orgView, setOrgView] = useState<any>(null);

    // 环境模拟初始相机信息
    const EnvSimulationCameraInfo = {
        cameraHPR: {heading: 6.652918163566034, pitch: -23.670164833832093, roll: 0.021378797704744146},
        cameraHeight: {longitude: 1.8161613604038636, latitude: 0.5365270736995406, height: 1941.1891017571359},
        midLocation: {lon: 104.06374491834225, lat: 30.78044342788164},
        maxx: 104.16204226936144,
        maxy: 30.88199944629672,
        minx: 103.99029394786989,
        miny: 30.759869733757323,
    }

    useEffect(() => {
        const tmpView = CesiumApi.initMap(id, true);
        setOrgView(tmpView);
        if (orgView) {
            // 
        }
        // eslint-disable-next-line
    }, [])

    // 总览
    const handleOverview = () => {
        if (orgView) {
            CesiumApi.flyToPoint(orgView, { lng: 104.067438, lat: 30.774583, height: 5500 })           
        }
    }

    // 环境模拟
    const handleEnvSimulation = () => {
        if (!orgView) return;
        if (!isUseArcgis) {
            CesiumApi.addArcgisMap(orgView);
            isUseArcgis = true;
        }
        CesiumApi.addWeatherCondition(orgView);
        CesiumApi.goToBookMark(orgView, EnvSimulationCameraInfo);        
    }

    // 变化模拟
    const handleWaterSimulation = () => {
        if (!orgView) return;
        if (!isUseArcgis) {
            CesiumApi.addArcgisMap(orgView);
            isUseArcgis = true;
        }
        CesiumApi.goToBookMark(orgView, EnvSimulationCameraInfo);
        CesiumApi.clearWeatherCondition(orgView);
        setTimeout(() => {
            CesiumApi.addDynamicChange(orgView);
        }, 3000);
    }

    // 相机信息
    const handleGetCameraInfo = () => {      
        if (orgView) {
            const info: any = CesiumApi.getCurrentCameraInfo(orgView);
            console.log("相机信息：", info);
        }
    }

    const getCord = () => {
        if (orgView) {
            CesiumApi.clickToGetCord(orgView);
        }
    }

    const handleWaterFlood = () => {
        if (!orgView) return;
        if (!isUseArcgis) {
            CesiumApi.addArcgisMap(orgView);
            isUseArcgis = true;
        }
        CesiumApi.goToBookMark(orgView, EnvSimulationCameraInfo);
        CesiumApi.clearWeatherCondition(orgView);
       CesiumApi.addWaterFlood(orgView);
    }

    const handleGo = () => {
        if (!orgView) return;
        if (!isUseArcgis) {
            CesiumApi.addArcgisMap(orgView);
            isUseArcgis = true;
        }
        CesiumApi.addTestFlightLine(orgView);
    }

    return (
        <div className="main-map-container">

            <div id={id} />

            {/* 按钮区 */}
            <div className="test-btn-group">
                <div className="sig-btn" onClick={() => { handleOverview() }} >总览</div>
                <div className="sig-btn" onClick={() => { handleEnvSimulation() }} >环境模拟</div>
                <div className="sig-btn" onClick={() => { handleWaterSimulation() }} >变化模拟</div>
                <div className="sig-btn" onClick={() => { handleWaterFlood() }} >淹没分析</div>
                <div className="sig-btn" onClick={() => { handleGo() }} >飞行</div>
                <div className="sig-btn" onClick={() => { handleGetCameraInfo() }} >获取相机信息</div>
                <div className="sig-btn" style={{ display: "none" }} onClick={() => { getCord() }} >get坐标</div>
            </div>


        </div>
    )
}

export default JdyDemo;

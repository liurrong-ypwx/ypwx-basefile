import React, { useEffect, useState } from "react";
import "./ChBuild.less";
import * as CesiumApi from "../../../utils/CesiumApi/CesiumApi";
import { titleList } from "./TuCao";


function ChBuild(): JSX.Element {

    const [orgView, setOrgView] = useState<any>(null);
    const [tpShow, setTpShow] = useState(false);
    const [tpX, setTpX] = useState(0);
    const [tpY, setTpY] = useState(0);

    useEffect(() => {
        const tmpView = CesiumApi.initMap("cesiumContainer", true);
        setOrgView(tmpView);
    }, [])

    useEffect(() => {
        if (!orgView) return;
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
   
    // 2021-04-13 粉刷匠 关于 cesium 与实际数据联动
    useEffect(() => {
        if (orgView) {
            CesiumApi.addDivTxtBoard(orgView, eventPro);
        }

        // eslint-disable-next-line
    }, [orgView])

    const eventPro = {
        click: (e: any) => {
            console.log("地址：", e);
            setTpShow(true);
            setTpX(e.x * 0.01);
            setTpY(e.y * 0.01)
        }
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
        
            {/* 地图提示区 */}
            <div className="map-tooltip-lrr" style={{ display: tpShow ? "" : "none", left: `${tpX}rem`, top: `${tpY}rem` }} >
                <div className="mtl-title">测绘案例分析</div>
                <div className="mtl-pair"><div className="mtl-pair-1">作者：</div><div className="mtl-pair-2">王小舟</div></div>
                <div className="mtl-pair"><div className="mtl-pair-1">日期：</div><div className="mtl-pair-2">2021-04-13</div></div>
                <div className="mtl-pair"><div className="mtl-pair-1">状态：</div>
                    <div className="mtl-btn"><div>第一版</div><div>第二版</div></div>
                </div>
            </div>
        
        </div>
    )
}

export default ChBuild;
import React, { useEffect } from "react";
import "./LoadModel.less";
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
window.CESIUM_BASE_URL = './cesium/';

let viewer: any;
function LoadModel(): JSX.Element {
 
    // 粉刷匠 第一次渲染后执行，仅执行一次
    useEffect(() => {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';
        viewer = new Cesium.Viewer("cesiumContainer", {
            infoBox: false,
            selectionIndicator: false,
            shadows: true,
            shouldAnimate: true
        })
        // eslint-disable-next-line
    }, [])

    // 粉刷匠 创建模型
    const createModel = (url: string, height: number = 0) => {

        viewer.entities.removeAll();
        const position = Cesium.Cartesian3.fromDegrees(
            -123.0744619,
            44.0503706,
            height
        );
        const heading = Cesium.Math.toRadians(135);
        const pitch = 0;
        const roll = 0;
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            hpr
        );

        const entity = viewer.entities.add({
            name: url,
            position: position,
            orientation: orientation,
            model: {
                uri: url,
                minimumPixelSize: 128,
                maximumScale: 20000,
            },
        });
        viewer.trackedEntity = entity;

    }

    const addItem = (type: string) => {
        if (type === "Cesium_Air") {
            // 注意这个路径的设置可以是 https://**********/**.glb  也可以放在public下 */ */
            createModel("Models/Cesium_Air.glb", 0);
        } else if (type === "PSFS") {
            createModel("Models/PSFS.glb", 0);
        }else if (type === "wood") {
            createModel("Models/wood0.glb", 0);
        }
    }

    return (
        <div className="main-map-container">
            {/* 初始化一个框来放置场景 */}
            <div id='cesiumContainer' />
            <div style={{ position: "fixed", zIndex: 1, top: 5, left: 5 }}>
                <button onClick={() => { addItem("Cesium_Air") }} >Cesium_Air</button>
                <button onClick={() => { addItem("PSFS") }} >PSFS</button>
                <button onClick={() => { addItem("wood") }} >wood</button>
            </div>
            
        </div>
    )
}

export default LoadModel;
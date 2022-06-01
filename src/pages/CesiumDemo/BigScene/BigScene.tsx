import React, { useEffect, useState } from "react";
import "./BigScene.less";
import * as CesiumApi from "./util/CesiumApi";
import { Popover } from "antd";
import bz_img from "../../../assets/image/bzAll.png";
import dm_img from "../../../assets/image/dmAll.png";

function BigScene(props: any): JSX.Element {
    const mapId = "ID_BIG_SCENE";
    const [view, setView] = useState<any>(null);
    const [tipX, setTipX] = useState(100);
    const [tipY, setTipY] = useState(100);
    const [isShowTip, setIsShowTip] = useState(false);
    const [tipContent, setTipContent] = useState<any>(null);

    useEffect(() => {
        const tmpView = CesiumApi.initMap(mapId, hoverCallBack);
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

    const hoverCallBack = (hoverInfo: any) => {

        if (hoverInfo && hoverInfo.show) {
            const property: any = hoverInfo.pickedFeature.id;
            setIsShowTip(true);
            setTipX(hoverInfo.position.x);
            setTipY(hoverInfo.position.y);

            const typeIndex = property.name.indexOf('type');
            const type = property.name.substring(typeIndex + 4)
            // const nameArr = ['视频', '人员', '泵闸', '断面', '水位', '事件'];

            if (+type === 2) {
                const tmpContent = (
                    <div className="field-container field-container-l1">
                        <img src={bz_img} alt="" />
                    </div>
                )
                setTipContent(tmpContent);
            } else {

                const tmpContent = (
                    <div className="field-container field-container-l2">
                        <img src={dm_img} alt="" />
                    </div>
                )
                setTipContent(tmpContent);
            }


        } else {
            setIsShowTip(false);
        }
    }

    const addBookMark = () => {
        if (!view) return;
        const info = CesiumApi.getCurrentCameraInfo(view);
        console.log(info);

        
    }

    return (
        <div className="big-scene">
            <div id={mapId} className="big-scene-map-container" />

            <div className="bg-top" />

            <div className="mid-display-number">
                <div className="sig-block">
                    <div>本年预警</div>
                    <div>1090</div>
                </div>
                <div className="sig-block">
                    <div>当月预警</div>
                    <div>398</div>
                </div>
                <div className="sig-block">
                    <div>当日预警</div>
                    <div>9</div>
                </div>
            </div>

            <div className="left-win">
                <div className=" left-win-img left-win-img1" />
                <div className="left-win-img left-win-img2" />
            </div>

            <div className="right-win">
                <div className=" right-win-img right-win-img1" />
            </div>

            <div className="test-btn-group" style={{ display: "none" }}>
                <div className="sig-btn" onClick={() => { addBookMark() }}  >点击获取当前相机信息</div>
                <div className="sig-btn" onClick={() => { CesiumApi.addTestFlightLine(view) }}>测试飞行</div>

            </div>

            <Popover placement="top" visible={isShowTip} content={tipContent} overlayClassName={`jj-ys-tip`}>
                <span className="tip-cord" style={{ left: tipX, top: tipY - 20 }} />
            </Popover>
        </div>
    )
}
export default BigScene;
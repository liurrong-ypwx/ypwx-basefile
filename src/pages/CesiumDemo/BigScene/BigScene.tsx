import React, { useEffect, useState } from "react";
import "./BigScene.less";
import * as CesiumApi from "./util/CesiumApi";
import { Popover, Modal, Slider } from "antd";
import bz_img from "../../../assets/image/bzAll.png";
import dm_img from "../../../assets/image/dmimg.png";
import ai_img from "../../../assets/image/ai2.jpg";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import tl from "../../../assets/image/tuli.png";
import { PointViewArr } from "./util/pointView";

function BigScene(props: any): JSX.Element {
    const mapId = "ID_BIG_SCENE";
    const [view, setView] = useState<any>(null);
    const [tipX, setTipX] = useState(100);
    const [tipY, setTipY] = useState(100);
    const [isShowTip, setIsShowTip] = useState(false);
    const [tipContent, setTipContent] = useState<any>(null);
    const [isShowModal, setIsShowModal] = useState(false);
    const [modalType, setModalType] = useState(1);
    const [isShowWin, setIsShowWin] = useState(true);
    const [pointView, setPointView] = useState(4);

    useEffect(() => {
        if (!isShowTip) return;
        setTimeout(() => {
            setIsShowTip(false);
        }, 3000);
    }, [isShowTip])

    useEffect(() => {
        if (!view) return;
        CesiumApi.zoomPipe(view, PointViewArr[pointView].cameraInfo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pointView, view])


    useEffect(() => {
        const tmpView = CesiumApi.initMap(mapId, hoverCallBack, clickCallBack);
        setView(tmpView);
        window.document.addEventListener('keyup', keyDown);
    }, []);

    const keyDown = (e: any) => {
   
        const code = +e.key;
        if (code >= 0 && code < 5) {
            setPointView(code);
        } else {
            setPointView(4);
        }
    }

    useEffect(() => {
        if (!view) return;
        CesiumApi.addTdt(view);
        CesiumApi.addPipe(view);
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

            if (+type === 0) {
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

    const clickCallBack = (hoverInfo: any) => {
        setIsShowTip(false);

        if (!hoverInfo || !hoverInfo.pickedFeature) return;
        const property: any = hoverInfo.pickedFeature.id;
        if (!property) return;

        const name = property.name;
        const typeIndex = property.name.indexOf('type');
        const type = property.name.substring(typeIndex + 4)
        if (name.indexOf('ai') !== -1) {
            setIsShowModal(true);
            setModalType(1);
        }

        if (+type === 0) {
            setIsShowModal(true);
            setModalType(2);
        }


    }

    const addBookMark = () => {
        if (!view) return;
        const info = CesiumApi.getCurrentCameraInfo(view);
        console.log(info);
    }

    const marks: any = {
        8: {
            style: {
                color: '#ffffff',
            },
            label: <strong>08:00</strong>,
        },
        // 1: '01:00',
        // 2: '02:00',
        // 3: '03:00',
        // 4: '04:00',
        // 5: '05:00',
        10: {
            style: {
                color: '#ffffff',
            },
            label: <strong>10:00</strong>,
        },
        // 7: '07:00',
        // 8: '08:00',
        // 9: '09:00',
        // 10: '10:00',
        // 11: '11:00',
        12: {
            style: {
                color: '#ffffff',
            },
            label: <strong>12:00</strong>,
        },
        14: {
            style: {
                color: '#ffffff',
            },
            label: <strong>14:00</strong>,
        },
        16: {
            style: {
                color: '#ffffff',
            },
            label: <strong>16:00</strong>,
        },
        // 13: '13:00',
        // 14: '14:00',
        // 15: '15:00',
        // 16: '16:00',
        // 17: '17:00',
        18: {
            style: {
                color: '#ffffff',
            },
            label: <strong>18:00</strong>,
        },
        // 19: '19:00',
        // 20: '20:00',
        // 21: '21:00',
        // 22: '22:00',
        // 23: {
        //     style: {
        //         color: '#f50',
        //     },
        //     label: <strong>23:00</strong>,
        // },
    };

    const formatter: any = (value: number) => `${value.toString().padStart(2, '0')}:00`;

    const [sliderValue, setSliderValue] = useState(10);
    const onChangeSlider = (value: any) => {
        setSliderValue(value);
    }

    useEffect(() => {
        if (!view) return;
        CesiumApi.addSunShadow(view, sliderValue);
    }, [sliderValue, view])

    return (
        <div className="big-scene">

            <Modal
                visible={isShowModal}
                footer={null}
                onCancel={() => { setIsShowModal(false) }}
                centered={true}
                className={`js-modal-container-lrr`}
            >
                {
                    modalType === 2 ? <video id="my_video_1" className="video-js vjs-default-skin" width="100%" height="100%"
                        controls preload="none" poster='http://video-js.zencoder.com/oceans-clip.jpg'
                        autoPlay={true}
                        data-setup='{ "aspectRatio":"640:267", "playbackRates": [1, 1.5, 2] }'>
                        <source src='http://192.168.0.104:3001/tv.mp4' type='video/mp4' />
                    </video> : <img src={ai_img} alt="" />
                }
            </Modal>

            <div id={mapId} className="big-scene-map-container" />

            <div className="bg-top" />

            <div className="btn" onClick={() => { setIsShowWin(!isShowWin) }} >{isShowWin ? "收起" : "展开"}</div>

            <div className={`map-legend ${isShowWin ? "" : "map-legend-left"}`}>
                <img src={tl} alt="" />
            </div>

            <div className="mid-display-number" style={{ display: "none" }}>
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

            <div className={`left-win ${isShowWin ? "" : "win-hide"}`}>
                <div className=" left-win-img left-win-img1" />
                <div className="left-win-img left-win-img2" />
            </div>

            <div className={`right-win ${isShowWin ? "" : "win-hide"}`}>
                <div className=" right-win-img right-win-img1" />
            </div>

            <div className="test-btn-group" >
                <div className="sig-btn" onClick={() => { addBookMark() }}  >点击获取当前相机信息</div>
                <div className="sig-btn" onClick={() => { CesiumApi.addTestFlightLine(view) }}>测试飞行</div>

            </div>

            <Popover placement="top" visible={isShowTip} content={tipContent} overlayClassName={`jj-ys-tip`}>
                <span className="tip-cord" style={{ left: tipX, top: tipY - 20 }} />
            </Popover>

            <div className="label-container" style={{ display: "none" }}>
                {
                    PointViewArr.map((item: any, index: any) => {
                        return (
                            <div className="sig-label" key={index} onClick={() => { setPointView(index) }} >{item.text}</div>
                        )
                    })
                }
            </div>

            <div className="time-slider-shadow">
                <div className="tss-text">一天时间变化</div>
                <div className="tss-choose">
                    <Slider className="slider-lrr"
                        marks={marks}
                        defaultValue={15}
                        max={18}
                        min={8}
                        step={1}
                        tipFormatter={formatter}
                        onChange={onChangeSlider}
                    />
                </div>
            </div>
        </div>
    )
}
export default BigScene;
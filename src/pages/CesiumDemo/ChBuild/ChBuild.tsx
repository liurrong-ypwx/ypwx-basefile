import React, { useEffect, useState } from "react";
import "./ChBuild.less";
import * as CesiumApi from "../../../utils/CesiumApi/CesiumApi";
import { titleList } from "./TuCao";
import { message, Popover } from "antd";
import echarts from "echarts";

let cordX: any = null;
let cordY: any = null;
let cordShow: boolean = false;
function ChBuild(): JSX.Element {

    const [orgView, setOrgView] = useState<any>(null);
    const [tpShow, setTpShow] = useState(false);
    const [tpX, setTpX] = useState(0);
    const [tpY, setTpY] = useState(0);
    // 场景书签
    const [bookMark, setBookMark] = useState<any>([]);

    useEffect(() => {
        const tmpView = CesiumApi.initMap("cesiumContainer", true);
        setOrgView(tmpView);
    }, [])

    useEffect(() => {
        if (!orgView) return;
        false && drawEchartQxt();
    }, [orgView])

    // 添加点线面
    // const handleAddGeometry = (type: string) => {
    //     if (!orgView) return;
    //     CesiumApi.addCustomGeometry(orgView, type);
    // }

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
            const showThisCase = false;
            if (showThisCase) {
                CesiumApi.addDivTxtBoard(orgView, eventPro);
            }
        }
        // eslint-disable-next-line
    }, [orgView])

    const eventPro = {
        click: (e: any) => {
            // console.log("地址：", e);
            setTpShow(true);
            setTpX(e.x * 0.01);
            setTpY(e.y * 0.01)
            cordX = e.x;
            cordY = e.y;
            cordShow = true;
        },
        // todo:注意，可优化
        wheel: (e: any) => {
            if (+e > 30000) {
                setTpShow(false);
                cordShow = false;
            }
        },
        update: (e: any) => {
            console.log("地址：", e);
            const diffZ = 1;
            const diffx = Math.abs(e.x - cordX);
            const diffy = Math.abs(e.y - cordY);
            const isShowNess = (diffx > diffZ) || (diffy > diffZ);
            if (cordShow && isShowNess) {
                setTpX(Math.ceil(e.x) * 0.01);
                setTpY(Math.ceil(e.y) * 0.01)
            }
        }
    }

    // 2021-04-16 粉刷匠 绘制函数 有高度的绘制
    const draw = (type: string) => {
        if (!orgView) return;
        CesiumApi.drawReal(orgView, type);
    }

    // 2021-04-19 粉刷匠 导出图片
    const exportPng = () => {
        if (!orgView) return;
        CesiumApi.exportPng(orgView);
    }

    const goToBookMark = (id: any) => {
        for (let i = 0; i < bookMark.length; i++) {
            if (bookMark[i].id === id) {
                CesiumApi.goToBookMark(orgView, bookMark[i].cameraInfo)
            }
        }
    }

    const addBookMark = () => {
        if (orgView) {
            // todo:获取当前相机参数
            const cameraInfo: any = CesiumApi.getCurrentCameraInfo(orgView);

            let tmpArr: any = bookMark.slice();
            const tmpTitle = "书签" + (bookMark.length + 1);
            tmpArr.push({
                "id": bookMark + 1,
                "name": tmpTitle,
                "cameraInfo": cameraInfo
            })

            setBookMark(tmpArr);

        } else {
            message.info('添加书签失败');
        }
    }

    // 2021-05-13 粉刷匠 画迁徙图
    const drawEchartQxt = () => {
        const tmpEl: any = document.getElementById('echart-qxt');
        const myChart = echarts.init(tmpEl);
        myChart.setOption({
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            }]
        });
    }

    // 书签
    const content = (
        <div className="book-mark-container">
            {
                bookMark && bookMark.length ? (
                    bookMark.map((item: any, index: any) => {
                        return (
                            <div key={index} className="sig-book-mark" onClick={() => { goToBookMark(item.id) }}>
                                {item.name}
                            </div>
                        )
                    })
                ) : "暂无标签"
            }
        </div>
      );

    return (
        <div className="main-map-container">
            {/* 初始化一个框来放置场景 */}
            <div id='cesiumContainer' >
                {/* <div id="slider"></div> */}
            </div>

            {/* 按钮区 */}
            <div  className="test-btn-group">
                <div className="sig-btn" onClick={() => { setDedaultExtent() }} >重置</div>
                {/* <div className="sig-btn" onClick={() => { handleAddGeometry("Point") }} >添加标注</div>
                <div className="sig-btn" onClick={() => { handleAddGeometry("Polyline") }} >添加Polyline</div>
                <div className="sig-btn" onClick={() => { handleAddGeometry("Polygon") }} >添加Polygon</div> */}
                <div className="sig-btn" onClick={() => { handleMeasure("distance") }} >测距</div>
                <div className="sig-btn" onClick={() => { handleMeasure("area") }} >测面积</div>
                <div className="sig-btn" onClick={() => { getPara() }} >获取相机参数</div>
                <div className="sig-btn" onClick={() => { testFly() }} title={titleList.testFly} >飞行</div>
                <div className="sig-btn" onClick={() => { exportPng() }} title={`导出为png`} >导出</div>

                <Popover content={content} title="Title" trigger="hover">
                    <div className="sig-btn" onClick={() => { addBookMark() }}  >书签</div>
                </Popover>

                {/* 绘制 */}
                <div className="sig-btn sig-btn-row">
                    <span className="sig-draw-btn sig-draw-btn-title">绘制</span>
                    <span className="sig-draw-btn" onClick={() => { draw("Point") }}>点</span>
                    <span className="sig-draw-btn" onClick={() => { draw("Line") }}>线</span>
                    <span className="sig-draw-btn" onClick={() => { draw("Area") }}>面</span>
                    <span className="sig-draw-btn" onClick={() => { draw("Text") }}>文字</span>
                    <span className="sig-draw-btn" onClick={() => { draw("Circle") }}>圆</span>
                    <span className="sig-draw-btn" onClick={() => { draw("Square") }}>矩形</span>
                    <span className="sig-draw-btn" onClick={() => { draw("Clear") }}>清空</span>
                    <span className="sig-draw-btn" onClick={() => { draw("Save") }}>保存</span>
                    <span className="sig-draw-btn" onClick={() => { draw("Edit") }}>编辑</span>
                </div>


            </div>

            {/* echart迁徙图容器 */}
            <div className="echart-qxt" id="echart-qxt" />

            {/* 热力图容器 */}
            <div className="div-heatmap" />

            {/* 视频投影 */}
            <video id="trailer" muted={true} autoPlay={true} loop={true} crossOrigin="" controls={true}>
                <source src="https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.webm" type="video/webm" />
                <source src="https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mp4" type="video/mp4" />
                <source src="https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mov" type="video/quicktime" />
                Your browser does not support the <code>video</code> element.
            </video>

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
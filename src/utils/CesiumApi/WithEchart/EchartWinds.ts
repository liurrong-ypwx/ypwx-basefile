import { combineEcharts } from './combineEchart';
import { winds } from "./winds";

export class EchartWinds {
    viewer: any;
    path: any;
    layerWork: any;

    constructor(viewer: any) {
        this.create(viewer);
        this.activate();
    }


    create(viewer: any) {
        this.viewer = viewer
        this.path = ''
    }

    activate() {
        const windData = winds;
        const data: any = [];
        let maxMag = 0;
        let minMag = Infinity;
        for (let j = 0; j < windData.ny; j++) {
            for (let i = 0; i <= windData.nx; i++) {
                // Continuous data.
                const p = (i % windData.nx) + j * windData.nx;
                const vx = windData.data[p][0];
                const vy = windData.data[p][1];
                const mag = Math.sqrt(vx * vx + vy * vy);
                // 数据是一个一维数组
                // [ [经度, 维度，向量经度方向的值，向量维度方向的值] ]
                data.push([
                    (i / windData.nx) * 360 - 180,
                    (j / windData.ny) * 180 - 90,
                    vx,
                    vy,
                    mag
                ]);
                maxMag = Math.max(mag, maxMag);
                minMag = Math.min(mag, minMag);
            }
        }

        const option = {
            animation: !1,
            GLMap: {},
            series: [
                {
                    name: '矢量场',
                    coordinateSystem: 'GLMap',
                    type: 'flowGL',
                    data: data,
                    supersampling: 4,
                    particleType: 'line',
                    particleDensity: 128,
                    particleSpeed: 1,
                    // gridWidth: windData.nx,
                    // gridHeight: windData.ny,
                    itemStyle: {
                        opacity: 0.7
                    }

                }
            ]
        };

        combineEcharts(this.viewer, option);

        // 2021-05-18 粉刷匠 觉得这个东西有点意思 留着
        // const pointList = convertData(data.sort(function (a, b) {
        //     return b.value - a.value;
        // }).slice(0, 6));

    }



}
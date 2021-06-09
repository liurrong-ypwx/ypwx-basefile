import React, { useEffect } from "react";
import "./TestPage.less";
import { Button } from "antd";
import { ApiFetch } from "../../utils/ApiFetch";

function TestPage(): JSX.Element {

    useEffect(() => {

        // aqi上的一些接口 "//api.waqi.info/search/?token=" + token() + "&keyword=" + keyword,
        //  "//api.waqi.info/feed/@" + station.uid + "/?token=" + token(),
        //  "https://api.waqi.info/map/bounds/?latlng=" + bounds + "&token=" + token()
        // "https://api.waqi.info/feed/@" + markerUID + "/?token=" + token()

        const url = "http://api.waqi.info/search/?keyword=shanghai"
        // const url = "https://api.waqi.info/feed/beijing/";
        const formPars = {
            token: "19776e0b379e0a6f7c0d85303cea703a5ee46281"
        }

        ApiFetch.get(url, formPars)
            .then((res: any) => {
                console.log(res)
            })
            .catch((err: any) => {
                console.log(err.msg)
            })

        calcTwoNumber();
 // eslint-disable-next-line 
    }, [])

    // 大数相乘
    const calcTwoNumber = () => {
        const a = '123';
        const b = '12';

        const maxLength = a.length + b.length + 1;

        const sigNum: any = [];
        for (let j = 0; j < b.length; j++) {
            const rightZero = b.length - j - 1;
            const rightZeroStr = ('').padEnd(rightZero, '0');
            const sigNumCal = (calSig(a, b[j]).join('') + rightZeroStr).padStart(maxLength, '0');
            sigNum.push(sigNumCal);
        }

        // 计算这些数的求和
        let totalData: any = [];
        for (let i = 0; i < maxLength; i++) {
            totalData.push('0');
        }

        let jin = 0;
        for (let i = maxLength - 1; i >= 0; i--) {
            let wei = 0;
            for (let j = 0; j < sigNum.length; j++) {
                wei += (+sigNum[j][i]);
            }
            wei += jin;
            totalData[i] = (wei % 10).toString();
            jin = (wei - (wei % 10)) / 10;
        }

        // 去掉左侧的0
        let zeroIndex = 0;
        for (let i = 0; i < totalData.length; i++) {
            if (totalData[i] !== '0') {
                zeroIndex = i;
                break;
            }
        }

        if ((zeroIndex + 1) === totalData.length) {
            console.log('数据相乘', 0);
            return;
        }

        totalData = totalData.slice(zeroIndex);
        console.log('数据相乘', totalData.join(''));

    }

    const calSig = (a: string, b: string) => {

        const maxLength = a.length + 1;

        // 计算每一行，右侧填0位数，左侧填0同位
        const numberArr: any = [];
        for (let i = 0; i < a.length; i++) {
            const pa = +a[i];
            const pb = +b;
            const pab = pa * pb;
            let tmpZero = '';
            for (let j = 0; j < (a.length - i - 1); j++) {
                tmpZero += '0';
            }
            const tmpNumber = (pab + tmpZero).padStart(maxLength, '0');
            numberArr.push(tmpNumber);
        }

        // 计算这些数的求和
        let totalData: any = [];
        for (let i = 0; i < maxLength; i++) {
            totalData.push('0');
        }

        let jin = 0;
        for (let i = maxLength - 1; i >= 0; i--) {
            let wei = 0;
            for (let j = 0; j < numberArr.length; j++) {
                wei += (+numberArr[j][i]);
            }
            wei += jin;
            totalData[i] = (wei % 10).toString();
            jin = (wei - (wei % 10)) / 10;
        }

        // 去掉左侧的0
        if (totalData[0] === '0') {
            totalData = totalData.slice(1);
        }

        return totalData;
    }

    return (
        <div className="testpage">
            <Button type="primary">test antd button</Button>

            hello testpage
            <div className="toparea">
                hello top
            </div>
            <div className="botarea">
                hello bot
                <div className="bot-top">
                    hello botbot
                </div>
                <button>test button</button>
            </div>

        </div>
    )
}

export default TestPage;
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
    }, [])

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
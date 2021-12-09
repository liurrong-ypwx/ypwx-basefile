import React, { useEffect, useState } from "react";
import "./UgPipe.less";
import * as CesiumApi from "../../../utils/CesiumApi/CesiumApi";

function UgPipe(props: any): JSX.Element {

    const cesiumContainerID = "idCesiumPipe";
    const [orgView, setOrgView] = useState<any>(null);


    useEffect(() => {
        const tmpView = CesiumApi.initMap(cesiumContainerID, true);
        setOrgView(tmpView);
       
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCord = () => {
        if (orgView) {
            CesiumApi.clickToGetCord(orgView);
        }
    }

    

    

    return (
        <div className="ug-pipe">
            {/* 初始化一个框来放置场景 */}
            <div id={cesiumContainerID} />

            {/* 按钮 */}
            <div className="btn-group">
                <div className="sig-btn" onClick={() => { getCord() }} >get坐标</div>
            </div>

        </div>
    )
}

export default UgPipe;
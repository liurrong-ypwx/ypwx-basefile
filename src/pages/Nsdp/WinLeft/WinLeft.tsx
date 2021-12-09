import React from "react";
import "./WinLeft.less";

function WinLeft(props: any): JSX.Element {
    const { setTestTxt } = props;
    return (
        <div>
            <button onClick={() => { setTestTxt(props.testTxt + 1) }} >点击</button>
            南山大屏 左侧面板
        </div>
    )
}

export default WinLeft;
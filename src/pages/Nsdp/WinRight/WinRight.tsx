import React from "react";
import "./WinRight.less";

function WinRight(props: any): JSX.Element {
    const { testTxt } = props;
    
    return (
        <div>
            南山大屏 右侧面板
            <button>展示{testTxt}</button>
        </div>
    )
}

export default WinRight;
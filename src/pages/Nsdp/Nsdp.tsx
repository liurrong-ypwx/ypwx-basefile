import React, { useState } from "react";
import "./Nsdp.less";
import WinLeft from "./WinLeft/WinLeft";
import WinRight from "./WinRight/WinRight";

function Nsdp(props: any): JSX.Element {

    const [testTxt, setTestTxt] = useState(0);

    if(window.AC){
        // 
        console.log("TEST", window.AC);
    }

    return (
        <div className="nsdp" >
            <WinLeft testTxt={testTxt} setTestTxt={setTestTxt} />

            <div className="nsdp-right">
                <WinRight testTxt={testTxt} />
            </div>

        </div>
    )
}

export default Nsdp;
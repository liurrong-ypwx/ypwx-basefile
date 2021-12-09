import React from "react";
import "./IframeTest.less";

function IframeTest(props: any): JSX.Element {
    return (
        <div className="iframe-test-demo">
            <div className="iframe-test-container">
                <iframe title="iframetest" width="100%" height="100%" frameBorder="0" src="http://192.168.207.155:3001/nsdp" >test</iframe>
            </div>
        </div>
    )
}

export default IframeTest;
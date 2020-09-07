import React from "react";
import "./TestPage.less";
import { Button } from "antd";

function TestPage(): JSX.Element {
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
import React from "react";
import "./TestPage.less";

function TestPage(): JSX.Element {
    return (
        <div className="testpage">
            hello testpage
            <div className="toparea">
                hello top
            </div>
            <div className="botarea">
                hello bot
                <div className="bot-top">
                    hello botbot
                </div>
            </div>

        </div>
    )
}

export default TestPage;
import React from "react";
import "./Overview.less";

export default function Overview(): JSX.Element {
    return (
        <div className="overview">
            <div>
                Use <b>esri-loader</b> with tools like <b>create-react-app</b>.
            </div>
            <div className="npm-install">
                npm install --save esri-loader
            </div>
        </div>
    )
}
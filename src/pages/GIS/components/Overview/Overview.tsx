import React from "react";
import "./Overview.less";

export default function Overview(): JSX.Element {
    return (
        <div className="overview">
            <div className="npm-top">
                Use <b>esri-loader</b> with tools like <b>create-react-app</b>.
            </div>
            <div className="npm-install">
                npm install --save esri-loader
            </div>
        </div>
    )
}
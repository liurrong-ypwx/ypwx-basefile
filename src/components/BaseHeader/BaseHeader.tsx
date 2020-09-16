import { Layout } from "antd";
import React, { useContext } from "react";
import { TContext } from "../../App";
import "./BaseHeader.less";
const { Header } = Layout;

// 2020-09-16 粉刷匠 顶栏
const BaseHeader: React.FC = () => {

    // 粉刷匠 为了测试context
    const context = useContext(TContext);
    const { state } = context;
    const { collapsed } = state;

    return (
        < Header className="base-header" >
            <div className="header-left">
                <i className="iconfont" >&#xe7b7;</i>
                <div className="header-title">
                    ArcGIS API for JS 学习总结
                    {
                        collapsed ? "折叠" : "展开"
                    }
                </div>
            </div>
        </Header >
    )
}

export default BaseHeader
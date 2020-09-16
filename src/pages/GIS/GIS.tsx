import React from "react";
import BaseHeader from "../../components/BaseHeader/BaseHeader";
import { Layout, Breadcrumb } from "antd";
import { withRouter } from "react-router-dom";
import "./GIS.less";
import BaseMenu from "../../components/BaseMenu/BaseMenu";
const { Content } = Layout;
function GIS(props: any): JSX.Element {



    return (
        <Layout className="gis-container" >

            {/* 顶栏 */}
            <BaseHeader />

            {/* 中间 */}
            <Layout>

                <BaseMenu />

                <Layout style={{ padding: '0 24px 24px' }} className="gis-content" >
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {props.children}
                    </Content>
                </Layout>

            </Layout>
        </Layout>
    )
}

export default withRouter(GIS);
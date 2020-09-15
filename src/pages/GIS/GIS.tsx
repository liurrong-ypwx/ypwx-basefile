import React, { useState } from "react";
import "./GIS.less";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
const { Header, Content, Sider } = Layout;

function GIS(): JSX.Element {

    const [collapsed, setCollapsed] = useState(false);


    return (
        <Layout className="gis-container" >
            <Header className="gis-header" >
                <div className="gis-logo-title">
                    <i className="iconfont" >&#xe664;</i>
                    <div className="gis-title">
                        ArcGIS API for JS 学习总结
                    </div>
                </div>                
            </Header>
            <Layout>
                <Sider width={200} className="gis-sider" >

                    <div className="gis-menu">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['0']}
                            // defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.Item key="0">总览</Menu.Item>
                            <SubMenu key="sub1" title="地图基础">
                                <Menu.Item key="1">开始</Menu.Item>
                                <Menu.Item key="2">选择底图</Menu.Item>
                                <Menu.Item key="3">添加图层</Menu.Item>
                                <Menu.Item key="4">图层符号化</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title="subnav 2">
                                <Menu.Item key="5">option5</Menu.Item>
                                <Menu.Item key="6">option6</Menu.Item>
                                <Menu.Item key="7">option7</Menu.Item>
                                <Menu.Item key="8">option8</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" title="subnav 3">
                                <Menu.Item key="9">option5</Menu.Item>
                                <Menu.Item key="10">option6</Menu.Item>
                                <Menu.Item key="11">option7</Menu.Item>
                                <Menu.Item key="12">option8</Menu.Item>
                            </SubMenu>

                        </Menu>


                    </div>
                    <div className="toggle-collapsed">

                        <i className="iconfont iconzhedie" />
                        <i className="iconfont" >&#xe620;</i>
                        <Button type="primary" onClick={() => setCollapsed(!collapsed)} >{collapsed ? "收起" : "打开"}</Button>
                    </div>

                </Sider>

                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        Content
                    </Content>
                </Layout>

            </Layout>
        </Layout>
    )
}

export default GIS;
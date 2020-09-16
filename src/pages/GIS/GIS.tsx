import React, { useState } from "react";
import "./GIS.less";
import { Layout, Menu, Breadcrumb } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { withRouter } from "react-router-dom";
const { Header, Content, Sider } = Layout;

function GIS(props: any): JSX.Element {

    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState([""]);

    const rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];

    const onOpenChange = (oKeys: any) => {
        console.log("okeys", oKeys);
        const latestOpenKey = oKeys.find((key:any) => openKeys.indexOf(key) === -1);
        console.log(latestOpenKey)
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          setOpenKeys(oKeys)
        } else {       
          setOpenKeys(latestOpenKey?[latestOpenKey] : [])
        }
    };


    return (
        <Layout className="gis-container" >

            {/* 顶栏 */}
            <Header className="gis-header" >
                <div className="gis-logo-title">
                    <i className="iconfont" >&#xe7b7;</i>
                    <div className="gis-title">
                        ArcGIS API for JS 学习总结
                    </div>
                </div>
            </Header>

            {/* 中间 */}
            <Layout>

                {/* 侧边栏 */}
                <Sider width={200} className="gis-sider"
                    collapsible={true}
                    collapsed={collapsed}
                    onCollapse={() => setCollapsed(!collapsed)} >

                    <div className="gis-menu">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['0']}
                            style={{ height: '100%', borderRight: 0 }}
                            inlineCollapsed={collapsed}
                            openKeys={openKeys}
                            onOpenChange={onOpenChange}
                        >
                            <Menu.Item key="0" icon={<i className="iconfont" >&#xe639;</i>}
                            onClick={()=>{props.history.push("/overview")}} 
                             >总览</Menu.Item>
                            <SubMenu key="sub1" icon={<i className="iconfont" >&#xe639;</i>} title="地图基础">
                                <Menu.Item key="1" onClick={() => props.history.push("/startgis")} >开始</Menu.Item>
                                <Menu.Item key="2">选择底图</Menu.Item>
                                <Menu.Item key="3">添加图层</Menu.Item>
                                <Menu.Item key="4">图层符号化</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<i className="iconfont" >&#xe639;</i>} title="subnav 2">
                                <Menu.Item key="5">option5</Menu.Item>
                                <Menu.Item key="6">option6</Menu.Item>
                                <Menu.Item key="7">option7</Menu.Item>
                                <Menu.Item key="8">option8</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" icon={<i className="iconfont" >&#xe639;</i>} title="subnav 3">
                                <Menu.Item key="9">option5</Menu.Item>
                                <Menu.Item key="10">option6</Menu.Item>
                                <Menu.Item key="11">option7</Menu.Item>
                                <Menu.Item key="12">option8</Menu.Item>
                            </SubMenu>

                        </Menu>
                    </div>


                </Sider>

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
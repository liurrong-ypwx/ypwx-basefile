import React, { useContext, useEffect, useState } from "react";
import * as ACTION_TYPE from "../../store/appStore/actionType";
import { withRouter } from "react-router-dom";
import SubMenu from "antd/lib/menu/SubMenu";
import { TContext } from "../../App";
import { Layout, Menu } from "antd";
import "./BaseMenu.less";
const { Sider } = Layout;

const BaseMenu: React.FC = (props: any) => {

    const context = useContext(TContext);
    const { state, dispatch } = context;
    const { collapsed } = state;

    const [tcollapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState([""]);
    const [selectedKeys, setSelectedKeys] = useState(['0']);

    const rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];

    useEffect(() => {
        console.log(props.history, "props.history")
        if (props.history) {
            const url = props.history.location.pathname;
            if (url === "/overview") {
                setSelectedKeys(['0'])
            } else if (url === "/startgis") {
                setSelectedKeys(['1'])
            }

        }

    }, [props.history])

    const onOpenChange = (oKeys: any) => {
        console.log("okeys", oKeys);
        const latestOpenKey = oKeys.find((key: any) => openKeys.indexOf(key) === -1);
        console.log(latestOpenKey)
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(oKeys)
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
        }
    };

    const onCollapse = () => {
        setCollapsed(!tcollapsed);
        dispatch({ type: ACTION_TYPE.COLLAPSED, data: !collapsed })
    }

    const onSelect = (item: any) => {
        setSelectedKeys(item.selectedKeys)
    }

    // 2020-09-16 粉刷匠 侧边栏
    return (
        < Sider width={200} className="base-sider"
            collapsible={true}
            collapsed={tcollapsed}
            onCollapse={() => { onCollapse() }} >

            <div className="base-menu">
                <Menu
                    mode="inline"
                    // defaultSelectedKeys={['0']}
                    selectedKeys={selectedKeys}
                    style={{ height: '100%', borderRight: 0 }}
                    inlineCollapsed={tcollapsed}
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    onSelect={onSelect}
                >
                    <Menu.Item key="0" icon={<i className="iconfont" >&#xe639;</i>}
                        onClick={() => { props.history.push("/overview") }}
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


        </Sider >
    )
}

export default withRouter(BaseMenu)
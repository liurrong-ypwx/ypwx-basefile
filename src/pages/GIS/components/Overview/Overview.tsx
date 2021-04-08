import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import "./Overview.less";

export default function Overview(): JSX.Element {

    // 第一次挂载后执行，仅执行一次
    useEffect(() => {
        // 假如当前窗口是一个iframe嵌入的其他的窗口
        if (window.parent !== window.self) {
            // 在父窗口创一个mask用于显示弹窗
            addMask();
        }
    }, [])

    // 添加父窗口
    const addMask = () => {
        const NewMask = window.parent.document.createElement("div");
        NewMask.id = "Mask_LRR";
        // NewMask.style.position = "absolute";
        // NewMask.style.top = "0";
        // NewMask.style.left = "0";
        NewMask.style.zIndex = "-999";
        // NewMask.style.backgroundColor = "#333333";
        // 兼容所有的浏览器
        // const w = window.parent.innerWidth
        //     || document.documentElement.clientWidth
        //     || document.body.clientWidth;

        // const h = window.innerHeight
        //     || document.documentElement.clientHeight
        //     || document.body.clientHeight;
        // NewMask.style.width = w + "px";
        // NewMask.style.height = h + "px";

        window.parent.document.body.appendChild(NewMask);
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onclickBut = () => {
        setIsModalVisible(!isModalVisible);      
    }


    return (
        <div className="overview">
            <div className="npm-top">
                Use <b>esri-loader</b> with tools like <b>create-react-app</b>.
            </div>
            <button onClick={() => { onclickBut() }} >按钮modal</button>
            <Modal wrapClassName="test-lrr"
                className="test-modal-lrr"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel} >
                <p>test</p>
            </Modal>
            <div className="npm-install">
                npm install --save esri-loader
            </div>
        </div>
    )
}
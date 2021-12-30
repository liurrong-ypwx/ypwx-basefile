import React from "react";
import "./CatalogueDisplay.less";
import SigButton from "./SigButton";

function CatalogueDisplay(props: any): JSX.Element {

    const data = {
        title: "河流水",
        key: "A",
        children: [
            {
                title: "市监测站",
                key: "A01",
                children: [
                    {
                        title: "南山区",
                        key: "A0101",
                    },
                    {
                        title: "龙华区",
                        key: "A0102",
                    }
                ]
            },
            {
                title: "一周一测",
                key: "A02",
                children: [
                    {
                        title: "第28周",
                        key: "A0201",
                        children: [
                            {
                                title: "总体水质",
                                key: "A020101",
                            },
                            {
                                title: "超标信息",
                                key: "A020102",
                            },
                            {
                                title: "总体水质",
                                key: "A020103",
                            },
                            {
                                title: "超标信息",
                                key: "A020104",
                            }
                        ]
                    },
                    {
                        title: "第29周",
                        key: "A0202",
                    }
                ]
            },
        ]
    }

    const getSimpleBlock = (block: any) => {
        return (
            <div className="sig-block">
                <div className="sig-block-left">
                    <SigButton title={block.title} />
                </div>
                <div className={`sig-block-right ${block.children ? block.children.length === 1 ? "sig-block-right-one" : "sig-block-right-mul" : ""} `}>
                    <div className="sbr-brackets" style={{ display: block.children ? "" : "none" }} />
                    <div className="sbr-list">
                        {
                            block.children ? block.children.map((e: any, index: any) => {
                                return (
                                    <div className={`sbr-block ${index === 0 ? "sbr-first" : ""} ${index === block.children.length - 1 ? "sbr-last" : ""}`}>
                                        {getSimpleBlock(e)}
                                    </div>
                                );
                            }) : null
                        }
                    </div>
                </div>

            </div>
        )
    }

    return (
        <div className="catalogue-display">
            {getSimpleBlock(data)}
        </div>
    )
}

export default CatalogueDisplay;
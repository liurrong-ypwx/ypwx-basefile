import React from "react";
import "./SigButton.less";

interface IProps{
    title: string
}
function SigButton(props: IProps): JSX.Element {
    return (
        <div className="sig-button">            
            {props.title}
        </div>
    )
}

export default SigButton;
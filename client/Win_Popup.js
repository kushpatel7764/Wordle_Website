import React from "react";

function WinPopup(props){
    return (props.trigger) ? (
        <div className="win_popup">
            <div className="win_popup_inner">
                {props.children}
            </div>
        </div>
    ) : "";
}

export default WinPopup;
import React from "react";

function LosePopup(props){
    return (props.trigger) ? (
        <div className="lose_popup">
            <div className="lose_popup_inner">
                {props.children}
            </div>
        </div>
    ) : "";
}

export default LosePopup;
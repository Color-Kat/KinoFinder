import React from "react";
import "./modal.css";

class Modal extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="modal">
               <div className="modal-message">{this.props.message}</div>
            </div>
        );
    }
}

export default Modal;

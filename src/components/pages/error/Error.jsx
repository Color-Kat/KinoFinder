import React from "react";
import "./error.scss";

class Error extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="errorPage">
                <div className="errorPage-message">{this.props.message}</div>
            </div>
        );
    }
}

export default Error;

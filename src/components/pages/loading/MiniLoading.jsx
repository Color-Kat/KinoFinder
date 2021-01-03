import React from "react";
import './miniLoading.css';

class MiniLoading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.isEnd) return (<div className="miniLoading">Загрузка...</div>);
        else return (<div className="miniLoading">Конец...</div>);
    }
}

export default MiniLoading;

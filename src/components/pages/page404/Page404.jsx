import React from "react";
import { Link } from "react-router-dom";
import page404gif from "./page404.gif";
import "./404.scss";

class Page404 extends React.Component {
	constructor (props) {
		super(props);
	}

	render () {
		return (
			<div id="page404">
				<img src={page404gif} alt="" style={{ zIndex: 1 }} />
				<div id="block404">
					<div id="info404">
						<span id="page404-title">404!</span>
						<br />
						<span id="page404-message">Такой страницы не существует!</span>
						<br />
						<Link to="/">Вернуться на главную</Link>
					</div>
				</div>
				<div id="bg404" />
			</div>
		);
	}
}

export default Page404;

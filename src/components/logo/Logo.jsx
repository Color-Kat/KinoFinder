import React from "react";
import logo from "@assets/icons/96x96.png";
import "./logo.scss";

class Logo extends React.Component {
	constructor (props) {
		super(props);
	}

	render () {
		return (
			<div className="logo">
				<img src={logo} alt="" />
				<h2>
					<div className="deskopName">ino</div>
					Finder
				</h2>
			</div>
		);
	}
}

export default Logo;

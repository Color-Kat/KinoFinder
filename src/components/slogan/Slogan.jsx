import React from "react";
import Logo from "@components/logo/Logo";
import "./slogan.scss";

class MovieCard extends React.Component {
	constructor (props) {
		super(props);
	}

	render () {
		return (
			<span className="slogan">
				<div className="logoTitle">
					<Logo />
					<div className="sloganText">&nbsp;-&nbsp;найди своё кино!</div>
				</div>
			</span>
		);
	}
}

export default MovieCard;

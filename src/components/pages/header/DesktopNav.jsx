import React from "react";
import { NavLink } from "react-router-dom";

class DesktopNav extends React.Component {
	constructor (props) {
		super(props);
	}

	render () {
		return (
			// Desktop navigation
			<nav>
				<ul className="nav-list">
					{Object.keys(this.props["nav-items"]).map(item => {
						return (
							<li className="nav-item" key={item}>
								<NavLink
									className="nav-link"
									exact={true}
									to={this.props["nav-items"][item]}
									activeClassName="selected"
								>
									{item}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</nav>
		);
	}
}

export default DesktopNav;

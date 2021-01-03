import React from "react";
import { NavLink } from "react-router-dom";

class MobileNav extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			mobileMenuActive: false
		};

		this.toggleIcon = this.toggleIcon.bind(this);

		window.onresize = () => {
			this.setState({ mobileMenuActive: false });
		};
	}

	toggleIcon () {
		this.setState(prevState => ({ mobileMenuActive: !prevState.mobileMenuActive }));
	}

	render () {
		return (
			<React.Fragment>
				{/* Mobile button */}
				<div className="menu-icon" onClick={this.toggleIcon}>
					<div
						className={`menu-icon-line ${this.state.mobileMenuActive
							? "menu-icon-active"
							: ""}`}
					/>
				</div>

				{/* Mobile navigation */}
				<nav
					className={`mobile-nav ${this.state.mobileMenuActive
						? "mobile-nav-active"
						: ""}`}
				>
					<ul className="mobile-nav-list">
						{Object.keys(this.props["nav-items"]).map(item => {
							return (
								<li className="mobile-nav-item" key={item}>
									<NavLink
										className="mobile-nav-link"
										exact={true}
										to={this.props["nav-items"][item]}
										activeClassName="selected"
										onClick={()=>this.setState({ mobileMenuActive: false })}
									>
										{item}
									</NavLink>
								</li>
							);
						})}
					</ul>
					<div className="nav-footer" />
				</nav>
			</React.Fragment>
		);
	}
}

export default MobileNav;

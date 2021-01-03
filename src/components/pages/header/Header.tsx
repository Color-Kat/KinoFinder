import React from "react";
import { Link } from "react-router-dom";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Search from "./Search";
import Logo from "@components/logo/Logo";
import "./header.scss";

interface HeaderProps {
	// navigation items (title - link)
	"nav-items": {
		[key: string]: string;
	};
	// moves search result to Kino
	insertSearchResultFunc: null | Function;
}
interface HeaderState {
	mobileMenuActive: boolean;
}

class Header extends React.Component<HeaderProps, HeaderState> {
	constructor (props: HeaderProps) {
		super(props);
	}

	public render () {
		return (
			<React.Fragment>
				<div className="header-block" />
				<header>
					<div className="nav-container">
						<Link to="/">
							<Logo />
						</Link>
						<Search />
						<div className="nav-wrapper">
							{/* Desktop navigation */}

							<DesktopNav nav-items={this.props["nav-items"]} />
							<MobileNav nav-items={this.props["nav-items"]} />
						</div>
					</div>
				</header>
			</React.Fragment>
		);
	}
}

export default Header;

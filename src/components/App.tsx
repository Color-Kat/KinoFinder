import React from "react";
import { BrowserRouter as Router, withRouter, RouteComponentProps } from "react-router-dom";
import Header from "./pages/header/Header";
import Main from "./pages/main/Main";

// insertSearchFunc - moves the search result between components (from search to kino)
interface states {
	insertSearchFunc: null | Function;
	filmUrl: string; // url to which the main link leads
}

// если сейчас search, то при нажатии на ссылку даем url \
// если

class App extends React.Component<{}, states> {
	constructor(props: any){
		super(props);

		this.state = {
			insertSearchFunc: null,
			filmUrl: '/'
		}

		this.setInsertFunc= this.setInsertFunc.bind(this);
	}

	// needed to get child function to insert
	// search result to Kino component
	setInsertFunc(func: Function) {
		this.setState({insertSearchFunc: func})
	}

	render() {
		return (
			<Router>
				<Header
					// navigation items (title - link)
					nav-items={{
						главная: this.state.filmUrl,
						профиль: "/profile"
					}}
					insertSearchResultFunc={this.state.insertSearchFunc}
				/>
				<Main
					setInsertFunc={this.setInsertFunc}
					changeMainLink={(url: string) =>{
						this.setState({filmUrl: url})
					}}
				/>
			</Router>
		);
	}
}
export default App;

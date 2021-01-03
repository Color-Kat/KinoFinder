import React from "react";
import { withRouter, RouteComponentProps  } from "react-router-dom";

interface ISearchProps {

}
interface ISearchState {
	query: string;
	searchScreen: boolean;

}

class Search extends React.Component<ISearchProps & RouteComponentProps, ISearchState> {
	constructor (props: ISearchProps & RouteComponentProps) {
		super(props);

		this.state = {
			query: this.props.location.pathname.indexOf("/search/") == 0 ? this.props.location.pathname.split('/')[2] : '',
			searchScreen: false // on mobile
		}

		this.search = this.search.bind(this);
		this.openSearchScreen = this.openSearchScreen.bind(this);
	}

	componentDidUpdate(prevProps: {location: any}) {
		// from search page to main page
		if (prevProps.location.pathname.indexOf("/search/") == 0 && this.props.location.pathname == '/') {
			// clear search query
			this.setState({query: ''});
		}
	}

	render () {
		return (
			<React.Fragment>
				{/* SEARCH FOR DESKTOP */}
				<div className="search-desktop">
					<label>
					<input 
						type="text" 
						placeholder="Поиск..." 
						onChange={e=>this.setState({query: e.target.value})} 
						onKeyPress={e => {if(e.key == "Enter") this.search();}}
						value={this.state.query}
					/>
					</label>
					{/* icon of search */}
					<span className="icon-search searchIcon" onClick={this.search} />
				</div>

				{/* SEARCH BUTTON TO OPEN THE INPUT SCREEN ON MOBILE */}
				<div className="search-mobile">
					<div className="search-mobile-btn" onClick={this.openSearchScreen}>
						<span className="icon-search searchIcon" />
						<div className="con_wrap" />
					</div>
					
				</div>

				{/* SEARCH SCREEN WITH INPUT */}
				<div className={`searchScreen ${this.state.searchScreen ? 'show' : 'hide'}`}>
					<div className="switchSearchScreen" onClick={()=>{this.setState({searchScreen: false})}} />
					<label style={{display: 'none'}} htmlFor="searchInp">Поиск</label>
					<input 
						className="searchScreenInput" 
						type="text" 
						placeholder="Поиск..." 
						onChange={e=>this.setState({query: e.target.value})} 
						onKeyPress={e => {if(e.key == "Enter") this.search();}}
						value={this.state.query}
						id="searchInp"
					/>
					<span className="icon-search" onClick={this.search}/>
				</div>
			</React.Fragment>
		);
	}

	openSearchScreen () {
		this.setState(prev => ({searchScreen: !prev.searchScreen}));
	}

	search () {
		// empty  request
		if (this.state.query == '') return;

		// on mobile hide search screen
		if (this.state.searchScreen) this.setState({searchScreen: false});

		// add a request to the history and the main component will receive a request and add films based on it
		this.props.history.push(`/search/${this.state.query}`)
	}
}



export default withRouter(Search);

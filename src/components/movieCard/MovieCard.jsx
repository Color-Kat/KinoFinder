import React from "react";
import { Link } from "react-router-dom";
import './movieCard.scss';

// const

class MovieCard extends React.Component {
	constructor (props) {
		super(props);

		// by the connection speed, we define the size of the picture
		if (navigator.connection.downlink > 2) this.IMG_PATH = "https://image.tmdb.org/t/p/w500";
		else this.IMG_PATH = "https://image.tmdb.org/t/p/w200";
	}

	render () {
		let item = this.props.movie;
		return (
			<li className="movie-item">
				<Link to={"/cinema/" + item.id}>
					<img src={this.IMG_PATH + item.poster_path} alt={item.title} />
					<div className="movie-info">
						<h3 className="movie-title">{item.title}</h3>
						<span className="movie-vote">{item.vote_average}</span>
					</div>
				</Link>
			</li>
		);
	}
}

export default MovieCard;

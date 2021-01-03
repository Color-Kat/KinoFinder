import React from "react";
import './movieList.scss'
import {ajax} from "@modules/ajax";
import MovieCard from "@components/movieCard/MovieCard";
import MiniLoading from "@components/pages/loading/MiniLoading";

interface IMovie {
    id: number;
    poster_path: string;
    title: string;
    vote_average: number;
}

interface IMovieListProps {
    title: string;
    moviesId: string[];
    changeStage: Function;
}

interface IMovieListStates {
    movies: IMovie[];
    error: boolean;
}

class MovieList extends React.Component<IMovieListProps, IMovieListStates> {
    private _isMounted: boolean = false;

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    constructor(props: IMovieListProps) {
        super(props);

        this.state = {
            movies: [],
            error : false
        }

        this.horizontalScroll = this.horizontalScroll.bind(this);
    }

    private async getFilmsByIds() {
        for (const item of this.props.moviesId.reverse()) {
            await ajax<IMovie[]>({
                action : 'getFilmById',
                film_id: item
            }).then(response => {
                    // add to movie list new movie data
                    if (this._isMounted) this.setState(prev => ({
                        // movies: prev.movies.concat(response.movie_results[0])
                        movies: prev.movies.concat(response)
                    }));
                }, () => {
                    if (this._isMounted) this.setState({error: true});
                }
            )
        }
    }

    componentDidUpdate(prevProps: { moviesId: string[] }) {
        // when props.moviesId is loaded
        // load data about all the movies
        if (prevProps.moviesId !== this.props.moviesId) {
            this.getFilmsByIds();
            this.props.changeStage(2); // update Profile component to show loaded page
        }
    }


    render() {
        return (
            <div className="movieList-wrapper">
                <span className="movieList-title">{this.props.title}</span>
                <div className="movieList" onWheel={(e) => this.horizontalScroll(e)}>
                    {this.props.moviesId.length !== 0 // films count != 0
                        ?
                        (this.state.movies.length === 0 ?
                            // films is not loaded yet
                            <MiniLoading />
                            :
                            // films is loaded
                            (<ul className="list">
                                {this.state.movies.map(item =>
                                    <MovieCard key={item.id} movie={item}/>
                                )}
                            </ul>))
                        :
                        (<div className="list empty">
                            <div className="list-empty">
                                <span className="empty-text">Вы еще ничего не смотрели :(</span>
                                <span className="empty-icon">Пусто</span>
                            </div>
                        </div>)
                    }
                </div>
            </div>
        );
    }

    private isScrolling = false;

    async horizontalScroll(e: WheelEvent & { target: { scrollLeft: number, scrollTo: Function }, wheelDelta: number }) {
        if (this.isScrolling) return;
        let delta = e.deltaY || e.detail || e.wheelDelta; // pixels of scrolling

        this.isScrolling = true;
        e.target.scrollTo({left: e.target.scrollLeft + delta * 2, behavior: 'smooth'});

        setTimeout(() => this.isScrolling = false, 150);
    }
}

export default MovieList;

import React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import ErrorPage from "@components/pages/error/Error";
import Loading from "@components/pages/loading/Loading";
import "./cinema.scss";
import {ajax} from "@modules/ajax";
import Modal from "@components/modal/modal";


type RouteParams = {
    filmId: string;
};

interface IFilmData {
    imdb_id: string | null;
    id: number | null;
    genres: { id: number; name: string }[] | null;
    title: string;
    overview: string;
    backdrop_path: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    budget: number;
    runtime: number;
    popularity: number;
    liked: boolean;
}

interface IState {
    liked: boolean;
    loading: boolean;
    error: boolean;
    stage: number;
    stagePage: JSX.Element | null;
    showModal: boolean;
}

interface IProps {
    // animation: string;
}

class Cinema extends React.Component<RouteComponentProps<RouteParams> & { openModal: Function}, IFilmData & IState> {
    private _isMounted: boolean = false;
    private IMGPATH: string     = "https://image.tmdb.org/t/p/w1280";

    constructor(props: any) {
        super(props);
        this.state = {loading: true, error: false, stage: 1, stagePage: null} as IState & IFilmData;

        this.like = this.like.bind(this);
    }

    async getData() {
        try {
            const data = await ajax<IFilmData>({
                action: 'getFilmData',
                id    : this.props.match.params.filmId
            });

            if (this._isMounted) this.setState({
                imdb_id      : data.imdb_id,
                id           : data.id,
                genres       : data.genres,
                title        : data.title,
                overview     : data.overview,
                backdrop_path: data.backdrop_path,
                poster_path  : data.poster_path,
                release_date : data.release_date,
                vote_average : data.vote_average,
                budget       : data.budget,
                runtime      : data.runtime,
                popularity   : data.popularity,
                loading      : false,
                liked        : data.liked,
                showModal    : false
            });

            // add_film_to_history(data.id as number);
            if (data.id != null) {
                ajax({
                    action : 'add_film_to_history',
                    film_id: data.id.toString()
                });
            }
        } catch {
            if (this._isMounted) this.setState({
                loading: false,
                error  : true
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        // get film data
        this.getData();
    }

    componentDidUpdate() {
        // component update when data id received
        // loading == false - data is received
        if (!this.state.loading) {
            // hide loading page and show cinema page
            this.setState({stage: 2});

            // for stop loop in componentDidUpdate
            this.setState({loading: true});
        }
    }

    render() {
        let prefix = "hide";
        if (this.state.stage == 1) prefix = "loading";
        else if (this.state.stage == 2) prefix = "show";

        let Content = () => {
            // when data is loaded check data
            // error screen
            if (this.state.error && !this.state.loading) return (
                <React.Fragment>
                    <Loading/>
                    <ErrorPage message="Произошла какая-то ошибка :(" status="fatal"/>
                </React.Fragment>
            );
            // and cinema page with data
            else {
                return (
                    <React.Fragment>
                        <Loading/>
                        <div className="page-cinema">
                            <span className="page-name">Cinema</span>
                            <div className="film-description-wrapper">
                                <div className="film-description">
                                    <h3 className="film-title">{this.state.title + ":"}</h3>
                                    <span className="film-overview">{this.state.overview}</span>
                                </div>
                                <img
                                    className="film-poster-mobile"
                                    src={this.IMGPATH + this.state.backdrop_path}
                                    alt={this.state.title}
                                />
                                <img
                                    className="film-poster-desktop"
                                    src={this.IMGPATH + this.state.poster_path}
                                    alt={this.state.title}
                                />
                            </div>

                            <div className="filmInfo">
                                <div>
								<span>
									{this.state.runtime}
                                    {/* <span className="filmInfo-title">мин</span> */}
								</span>
                                    <span className="icon-alarm"/>
                                </div>

                                {this.state.budget != 0 && (
                                    <div>
                                        {this.state.budget}
                                        <span className="icon-coin-dollar"/>
                                    </div>
                                )}

                                {this.state.popularity != 0 && (
                                    <div>
                                        {this.state.popularity}
                                        <span className="icon-stats-bars"/>
                                    </div>
                                )}
                                <div>
                                    {this.state.vote_average}
                                    <span className="icon-star"/>
                                </div>

                                <div
                                    onClick={this.like}
                                    className={this.state.liked ? "active" : "notActive"}
                                >
                                    <span className="icon-like"/>
                                </div>
                            </div>

                            <div className="film-player-wrapper">
                                <div className="film-player">
                                    <iframe
                                        src={`https://59.tvmovies.in/6hEJQRQkujRA?imdb_id=${this.state
                                            .imdb_id}`}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>

                        {this.state.showModal &&
                            <Modal message="Войдите в аккаунт"/>
                        }
                    </React.Fragment>
                );
            }
        };

        return <div className={`page ${prefix}`}>{Content()}</div>;
    }

    like() {
        if (!this.state.id) return;

        ajax({
            action : 'like',
            film_id: this.state.id.toString()
        }).then(response => {
            if (response) this.setState(prev => {
                return {liked: !prev.liked};
            });
            else{
                this.setState({showModal: true});
                setTimeout( ()=> {this.setState({showModal: false});}, 4000);
            }
        });
    }
}

export default withRouter(Cinema);
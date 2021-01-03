import React from "react";
import Slogan from "@components/slogan/Slogan";
import MovieCard from "@components/movieCard/MovieCard";
import ErrorPage from "@components/pages/error/Error";
import Loading from "@components/pages/loading/Loading";
import MiniLoading from "@components/pages/loading/MiniLoading";
import "./kino.scss";

class Kino extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            stage: 1,
            stagePage: null
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        // console.log(this.props.films.length)
        let Content     = () => {
            return (
                <div className="kino">
                    <Slogan/>
                    {/* if nothing is found show the error page */}
                    {this.props.films.length == 0 ? <ErrorPage message={'Ничего не найдено'}/> :
                        <>
                            <div className="page-name">Фильмы:</div>
                            <ul className="movies-grid grid">
                                {this.props.films.map(item => (
                                    <MovieCard
                                        key={item.id}
                                        movie={item}
                                        title={item.title}
                                        vote={item.vote_average}
                                    />
                                ))}
                            </ul>
                        </>
                    }
                </div>
            );
        };


        // if films are loaded for the first time
        if (!this.props.scrolled) {
            // loading
            if (!this.props.isLoaded) this.setState({stage: 1});

            // loaded
            if (this.props.isLoaded && !this.props.scrolled) {
                setTimeout(() => {
                    // when data is loaded
                    // wait a while for the data to be inserted
                    if (this._isMounted) this.setState({
                        stage: 2
                    });
                }, 200);
            }
            this.setState({
                stagePage: (
                    <React.Fragment>
                        <Loading/>
                        <Content/>
                    </React.Fragment>
                )
            });
        } else {
            // if films are loaded and page is scrolled to the end
            this.setState({
                stagePage: (
                    <React.Fragment>
                        <Loading/>
                        <Content/>
                        { !this.props.films.length == 0 &&
                        <MiniLoading isEnd={this.props.isEnd}/>}

                    </React.Fragment>
                ),
                stage: 2
            });
        }
    }


    render() {
        let prefix = "hide";
        if (this.state.stage == 1) prefix = "loading";
        else if (this.state.stage == 2) prefix = "show";

        return <div className={`page ${prefix}`}>{this.state.stagePage}</div>;
    }
}

export default Kino;

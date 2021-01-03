import React from "react";
import {Switch, Route, withRouter, RouteComponentProps} from "react-router-dom";

import {ajax} from "@modules/ajax";

import Kino from "@components/pages/kino/Kino";
import ProfilePage from "@components/pages/profile/ProfilePage";
import Cinema from "./cinema/Cinema";
import Page404 from "@components/pages/page404/Page404";
import ErrorPage from "@components/pages/error/Error";

import "./main.scss";
import Modal from "@components/modal/modal";

interface MainProps {
    setInsertFunc: Function;
    changeMainLink: Function; // change url in the link that leads to the main page
}

interface MainState {
    films: any[];
    error: null | string;
    isLoaded: boolean;
    scrolled: boolean; // if film loading after scrolling
    scrollingCoords: number;
    end: boolean; // if true - all films is received
    page: number;
    isAuth: boolean | null;
    showModal: boolean;
    modalMessage: string;
}

class Main extends React.Component<MainProps & RouteComponentProps, MainState> {
    state: Readonly<MainState>;
    private addition: boolean       = false;
    private _isMounted: boolean     = false;
    private scrollingCoords: number = 0;
    private main                    = React.createRef<HTMLElement>();

    componentWillUnmount() {
        this._isMounted = false;
    }

    constructor(props: any) {
        super(props);

        this.state = {
            films          : [],
            error          : null,
            isLoaded       : false,
            scrolled       : false,
            scrollingCoords: 0,
            end            : false,
            page           : 1,
            isAuth         : null,
            showModal      : false,
            modalMessage   : ''
        };

        this.props.setInsertFunc((items: any[]) => {
            this.setState({films: items})
        })

        this.mainScroll  = this.mainScroll.bind(this);
        this.authFunc    = this.authFunc.bind(this);
        this.handleModal = this.handleModal.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        this.getFilms();

        ajax<boolean>({
                action: 'checkAuth'
            }, this.handleModal
        ).then(response => {
            this.setState({isAuth: response});
        });

        // this.handleModal('Hi fffffffffffffffffffffffffffffffffffffffffffffffffffffffffhello');
    }

    private getFilms(page: number = 1): void {
        // main page
        if (this.props.location.pathname == "/") {
            ajax<{ page: number, total_pages: number, results: any[] }>({
                action: 'getFilms',
                page  : page.toString()
            }).then(
                response => {
                    let end = response.page >= response.total_pages; // all pages is loaded

                    if (this._isMounted) this.setState(prev => {
                        let films = prev.films.concat(response.results);
                        return {
                            films,
                            isLoaded: true,
                            error   : null,
                            page,
                            end
                        };
                    });
                    this.addition = false;
                },
                error => {
                    if (this._isMounted) this.setState({isLoaded: true, error: error});
                }
            );


        } else if (
            this.props.location.pathname.indexOf("/search/") == 0 // page with search result
        ) {
            if (this._isMounted) this.setState({isLoaded: false}); // wait for new request

            ajax<{ page: number, total_pages: number, results: any[] }>({
                action: 'search',
                query : this.props.location.pathname.split('/search/')[1],
                page  : page.toString()
            }).then(
                response => {
                    let end = response.page >= response.total_pages; // all pages is loaded

                    if (this._isMounted) this.setState(prev => {
                        let films = prev.films.concat(response.results);
                        return {
                            films,
                            isLoaded: true,
                            page,
                            end
                        };
                    });
                    this.addition = false;
                },
                error => {
                    if (this._isMounted) this.setState({isLoaded: true, error: error});
                }
            )
        }
    }

    private mainScroll(e: React.UIEvent) {
        if (this.state.end) return; // end of page
        let elem = e.target as Element;

        // add films
        if (!this.addition) {
            if (elem.scrollTop + elem.clientHeight + 200 >= elem.scrollHeight) {
                this.addition = true;
                // main page
                if (this.props.location.pathname == "/") {
                    this.setState(prev => {
                        this.getFilms(prev.page + 1);
                        return {page: prev.page + 1, scrolled: true};
                    });
                } else if (this.props.location.pathname.indexOf("/search/") == 0) {
                    // page with search result
                    this.setState(prev => {
                        this.getFilms(prev.page + 1);
                        return {page: prev.page + 1, scrolled: true};
                    });
                }
            }
        }

        // save coords
        // this.setState({scrollingCoords: elem.scrollTop});
        if (
            this.props.location.pathname == '/' || // main
            this.props.location.pathname.indexOf("/search/") == 0 // search
        ) this.scrollingCoords = elem.scrollTop;
    }

    componentDidUpdate(prevProps: { location: { pathname: string } }, prevState: { error: null | string }) {
        if (
            this.props.location.pathname != prevProps.location.pathname && // change url
            this.state == prevState // no loop
        ) {
            if (
                // search -> main
                (prevProps.location.pathname.indexOf("/search/") == 0 &&
                    this.props.location.pathname == '/') ||
                // main -> search
                (prevProps.location.pathname == '/' &&
                    this.props.location.pathname.indexOf("/search/") == 0) ||
                // search -> search (another query)
                (prevProps.location.pathname.indexOf("/search/") == 0 &&
                    this.props.location.pathname.indexOf("/search/") == 0) ||
                // Any page but films is not loaded yet
                this.state.films.length == 0
            ) {
                this.props.changeMainLink(this.props.location); // the link in the header leeds here

                // clear films list
                if (this._isMounted) this.setState({
                    films: [], // remove all old films
                    page : 1, // load new films starting from 1 page
                    end  : false, // films are not over yet
                    error: null
                });
                this.getFilms(); // get films by new query
            }

            // scroll main
            if (
                this.props.location.pathname == '/' ||  // any page -> main
                this.props.location.pathname.indexOf("/search/") == 0 // any page -> search
            ) {
                // scroll main to saved location (doesn't work without delay)
                setTimeout(() => {
                    if (this.main.current != null)
                        this.main.current.scrollTo(0, this.scrollingCoords);
                }, 20);
            } else if (this.main.current != null) // scroll on top (on other pages)
                this.main.current.scrollTo(0, 0);

        } else if (
            // the url in the address bar and the url in the header link are the same,
            // then it needs to redirect to the main
            prevProps.location.pathname == this.props.location.pathname &&
            // work only for...
            prevProps.location.pathname.indexOf("/search/") == 0 && // search page in address bar
            this.props.location.pathname.indexOf("/search/") == 0 && // and search page in header link
            this.state == prevState
        ) {
            this.props.changeMainLink('/'); // change url in header link
            this.props.history.push('/'); // and redirect to the main page for change url in address bar
        }
    }

    public render() {
        const Content = () => {
            if (this.state.error === null) {
                return (
                    <Switch>
                        {/* list of popular movies */}
                        <Route
                            exact path="/"
                            component={() => (
                                <Kino
                                    films={this.state.films}
                                    isLoaded={this.state.isLoaded}
                                    scrolled={this.state.scrolled}
                                />
                            )}
                        />
                        {/* list of search */}
                        <Route path="/search/:query" render={() => {
                            // this.getFilms();

                            return (<Kino
                                films={this.state.films}
                                isLoaded={this.state.isLoaded}
                                scrolled={this.state.scrolled}
                                isEnd={this.state.end}
                            />)
                        }}/>
                        {/* Cinema */}
                        <Route path="/cinema/:filmId" component={() => (<Cinema openModal={this.handleModal}/>)}/>
                        {/* profile */}
                        <Route
                            path="/profile"
                            component={() => (
                                <ProfilePage isAuth={this.state.isAuth} authFunc={this.authFunc}/>
                            )}
                        />
                        {/* 404 */}
                        <Route component={Page404}/>
                    </Switch>
                );
            } else {
                return (
                    <div className={`page show`}>
                        <ErrorPage message={this.state.error}/>
                    </div>
                )
            }
        };

        let scrollCondition = this.props.location.pathname === "/" || this.props.location.pathname.indexOf("/search/") == 0;

        return (
            <React.Fragment>
                {scrollCondition ? (
                        <main onScroll={this.mainScroll} ref={this.main}>
                            <Content/>
                        </main>
                    )
                    : (
                        <main ref={this.main}>
                            <Content/>
                        </main>
                    )}

                {this.state.showModal &&
                <Modal message={this.state.modalMessage} close={this.handleModal}/>
                }
            </React.Fragment>
        );
    }

    public authFunc(result = false) {
        this.setState({isAuth: result});
    }

    public handleModal(message: string = '') {
        this.setState((prev) => {
            return {
                showModal   : !prev.showModal,
                modalMessage: message
            }
        });
    }
}

export default withRouter(Main);

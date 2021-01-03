import React from "react";
import {ajax} from "@modules/ajax";
import Error from "@components/pages/error/Error";
import MovieList from "@components/movieCard/MovieList";

interface IProps {
    changeStage: Function;
    authFunc: Function;
}

interface IProfileDataType {
    email: string;
    nickname: string;
    history: string[];
    liked: string[];
    error: boolean;
    loaded: boolean;
}

class ProfilePage extends React.Component<IProps, IProfileDataType> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            email   : "",
            history : [],
            liked   : [],
            nickname: "",
            error   : false,
            loaded  : true
        }

        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        ajax<{
            email: string,
            nickname: string,
            history: string,
            liked: string
        } | false>({
            action: 'getUserData'
        }).then(
            response => {
                if (response)
                    this.setState({
                        email   : response.email,
                        nickname: response.nickname,
                        history : JSON.parse(response.history),
                        liked   : JSON.parse(response.liked),
                        loaded  : false
                    });
                else
                    this.setState({
                        error : true,
                        loaded: true
                    });
            },
            error => {
                this.setState({
                    error : true,
                    loaded: true
                });
            }
        )
    }

    render() {
        if (this.state.error) return <Error message={'Произошла какая-то ошибка :(('}/>;
        else return (
            <React.Fragment>
                <div className="greeting page-name">{this.state.nickname}</div>
                <div className="history">
                    <MovieList title='История' moviesId={this.state.history} changeStage={this.props.changeStage}/>
                </div>
                <div className="like">
                    <MovieList title='Избранное' moviesId={this.state.liked} changeStage={this.props.changeStage}/>
                </div>
                <button className="btn exit-btn" onClick={this.logOut}>Выйти</button>
            </React.Fragment>
        );
    }

    private logOut() {
        ajax({
            action: 'exit'
        }).then(response => {
            if (response) this.props.authFunc(false);
        });
    }
}

export default ProfilePage;

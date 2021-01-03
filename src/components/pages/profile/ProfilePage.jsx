import React from "react";
import Loading from "@components/pages/loading/Loading";
import LoginForm from "./login/LoginForm";
import Profile from "./profilePage/Profile.tsx";
import "./profile.scss";
import Error from "@components/pages/error/Error";

class ProfilePage extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            stage    : 1,
            stagePage: null
        };

        this.changeStage = this.changeStage.bind(this);
    }

    changeStage(stage) {
        if (this._isMounted) this.setState({stage: stage});
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        // loading because data is not loaded
        if (this.props.isAuth == null) {
            this.setState({
                stage    : 2,
                stagePage: (
                    <Error message="Произошла какая-то ошибка :+("/>
                )
            });
        }
        // loaded and page is loginForm (user is not authorized)
        else if (!this.props.isAuth) {
            this.setState({
                stage    : 1,
                stagePage: (
                    <React.Fragment>
                        <Loading/>
                        <div className="profile">
                            {/* function for change isAuth in Main component */}
                            <LoginForm authFunc={this.props.authFunc}/>
                        </div>
                    </React.Fragment>
                )
            });
            setTimeout(() => {
                // when data is loaded
                // wait a while for the data to be inserted
                if (this._isMounted) this.setState({
                    stage: 2
                });
            }, 200);
        } else if (this.props.isAuth) {
            // loaded and page is profile because user is authorized
            this.setState({
                stage    : 1,
                stagePage: (
                    <React.Fragment>
                        <Loading/>
                        <div className="profile">
                            {/*using changeStage after loading the profile data
                             this component will update the stage state*/}
                            <Profile changeStage={this.changeStage} authFunc={this.props.authFunc}/>
                        </div>
                    </React.Fragment>
                )
            });
            // setTimeout(() => {
            //     // when data is loaded
            //     // wait a while for the data to be inserted
            //     if (this._isMounted) this.setState({
            //         stage: 2
            //     });
            // }, 200);
        }
    }

    render() {
        let prefix = "hide";
        if (this.state.stage == 1) prefix = "loading";
        else if (this.state.stage == 2) prefix = "show";

        return <div className={`page ${prefix}`}>{this.state.stagePage}</div>;
    }
}

export default ProfilePage;

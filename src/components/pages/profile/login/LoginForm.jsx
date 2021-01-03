import React from "react";
import Logo from "@/components/logo/Logo";
import loginIllustration from "../illustrations/login-illustration.svg";
import {ajax} from "@modules/ajax";
import './login.scss';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email          : "",
            password       : "",
            name           : "",
            errorMessage   : "",
            changeForm     : false,
            registrationEnd: false
        };

        this.verified = {
            email: false,
            pass : false,
            name : false
        };

        this.login           = this.login.bind(this);
        this.registration    = this.registration.bind(this);
        this.emailHandler    = this.emailHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
        this.nameHandler     = this.nameHandler.bind(this);
        this.changeForm      = this.changeForm.bind(this);
    }

    emailHandler(e) {
        let emailInp     = e.target.value, //target value
            errorMessage = ""; // errorMessage

        if (emailInp != "") {
            // regex for mail
            const mailRegEx = {
                ename: /^[\w.*-]+(?=@|$)/,
                edog : /^([\w.*-]+@)/,
                ecom : /^([\w.*-]+@([\w-]+\.)+[\w-]{2,4})?$/
            };

            if (!mailRegEx.ename.test(emailInp)) errorMessage = "Недопустимые символы";
            else if (!mailRegEx.edog.test(emailInp)) errorMessage = "Отсутствует @";
            else if (!mailRegEx.ecom.test(emailInp)) errorMessage = "Неправильный домен почты";
            else this.verified.email = true;
        }

        this.setState({email: emailInp, errorMessage});
    }

    passwordHandler(e) {
        let passInp      = e.target.value, //target value
            errorMessage = ""; // errorMessage

        if (passInp != "") {
            // regex for password
            const pasRegEx = {
                pasNum   : /(?=.*[0-9])/,
                pasLetter: /(?=.*[a-z])/i,
                pasFull  : /[0-9a-z]{6,127}/i
            };

            if (!pasRegEx.pasNum.test(passInp)) errorMessage = "Нет цифр";
            else if (!pasRegEx.pasLetter.test(passInp)) errorMessage = "Нет латинских букв";
            else if (!pasRegEx.pasFull.test(passInp)) errorMessage = "Пароль менее 6 символов";
            else this.verified.pass = true;
        }

        this.setState({password: passInp, errorMessage});
    }

    nameHandler(e) {
        let nameInp      = e.target.value, //target value
            errorMessage = ""; // errorMessage

        if (nameInp != "") {
            // regex for user name
            const nameRegEx = {
                simbols: /^[\w]+$/ui,
                length : /^[\w]{2,12}$/ui
            };

            if (!nameRegEx['simbols'].test(nameInp)) errorMessage = "Недопустимые символы";
            else if (!nameRegEx['length'].test(nameInp)) errorMessage = "Ник не соответствует размеру";
            else this.verified.name = true;
        }

        this.setState({name: nameInp, errorMessage});
    }

    render() {
        return (
            // determine which form is currently open (login (if changeForm == false) or registration)
            // and hide the desired form using the class
            <div
                className={`loginFormWrapper ${!this.state.changeForm
                    ? "loginShow"
                    : "registrationShow"}`}
            >
                {/* ----------------LOGIN FORM--------------- */}
                <div className="loginForm-grid login">
                    <div className="illustration">
                        <Logo/>
                        <img
                            className="illustrationc"
                            src={loginIllustration}
                            alt="Login illustration"
                        />
                    </div>
                    <form className="loginForm" onSubmit={this.login}>
                        <div className="formName">Войти</div>
                        <div className="formError">{this.state.errorMessage}</div>
                        {/* <div>{this.state.}</div> */}
                        <div className="fields">
                            <div className="inputCase case1">
                                <input
                                    type="text"
                                    onChange={this.emailHandler}
                                    value={this.state.email}
                                    placeholder="Ваш email"
                                />

                                <input
                                    type="text"
                                    onChange={this.passwordHandler}
                                    value={this.state.password}
                                    placeholder="И ваш пароль;)"
                                />
                            </div>

                            <input type="submit" value="Войти"/>
                        </div>
                    </form>
                    <div className="changeFormBtn">
                        <div className="link" onClick={this.changeForm}>
                            {"Зарегестрироваться"}
                        </div>
                    </div>
                </div>

                {/* ----------------REGISTRATION FORM--------------- */}

                <div className="loginForm-grid registration">
                    <div className="illustration">
                        <Logo/>
                        <img
                            className="illustrationc"
                            src={loginIllustration}
                            alt="Login illustration"
                        />
                    </div>
                    <form className="loginForm" onSubmit={this.registration}>
                        <div className="formName">Регистрация</div>
                        <div className="formError">{this.state.errorMessage}</div>
                        <div
                            className={`fields ${!this.state.registrationEnd
                                ? "reg_stage_1"
                                : "reg_stage_2"}`}
                        >
                            <div className="inputCase case1">
                                <input
                                    type="text"
                                    onChange={this.emailHandler}
                                    value={this.state.email}
                                    placeholder="Ваш email"
                                />

                                <input
                                    type="text"
                                    onChange={this.passwordHandler}
                                    value={this.state.password}
                                    placeholder="Придумайте пароль"
                                />
                            </div>
                            <div className="inputCase case2">
                                <input
                                    type="text"
                                    onChange={this.nameHandler}
                                    value={this.state.name}
                                    placeholder="Ваш ниk"
                                />
                            </div>

                            {this.state.registrationEnd && (
                                <button
                                    className="back"
                                    onClick={() => this.setState({registrationEnd: false})}
                                >
                                    Назад
                                </button>
                            )}
                            <input type="submit" value="Далее"/>
                        </div>
                    </form>
                    <div className="changeFormBtn">
                        <div className="link" onClick={this.changeForm}>
                            {"Войти"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    changeForm() {
        this.setState(prev => {
            return {
                changeForm  : !prev.changeForm,
                email       : "",
                password    : "",
                errorMessage: ""
            };
        });
    }

    login(e) {
        e.preventDefault();

        if (this.verified.email && this.verified.pass) {
            ajax({
                action  : 'login',
                email   : this.state.email,
                password: this.state.password
            }).then(result => {
                if (result) this.props.authFunc(result);
                else this.setState({errorMessage: 'Неправильный email или пароль'})
            });
        } else this.setState({errorMessage: "Введены неверные данные"});
    }

    registration(e) {
        e.preventDefault();

        if (this.state.registrationEnd) {
            if (Object.values(this.verified).every(item => item === true)) {
                ajax({
                    action  : 'registration',
                    email   : this.state.email,
                    password: this.state.password,
                    nickname: this.state.name
                }).then(result => {
                    if (result) this.props.authFunc(result);
                    else this.setState({errorMessage: 'Такой email уже зарегистрирован'})
                });
            } else this.setState({errorMessage: "Введены неверные данные"});
        } else {
            this.setState({registrationEnd: true});
        }
    }
}

export default LoginForm;

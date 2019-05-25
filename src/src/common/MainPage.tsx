import React from "react";
import { Router, Route, RouteComponentProps } from "react-router-dom";
import { History, createBrowserHistory } from "history";
import { StaticContext } from "react-router";
import NavBar from "./Navigation/NavBar";
import ProfilePage from "./Profile/ProfilePage";
import { INavBarOptions } from "./Navigation/INavBarOptions";
import SignInPage from "./SignIn/SignInPage";
import IProfile from "./Profile/IProfile";
import Profile from "./Backend/Profile";
import QrCodeReaderPage from "./QRCode/QRCodeReaderPage";
import QrCodePage from "./QRCode/QRCodePage";
import './MainPage.css';

interface IState {
    isAuth: boolean;
    profile: IProfile | null;
    history: History<any>;
    navBarOptions: INavBarOptions,
    qrReader: string
}

export interface Props { }

class MainPage extends React.Component<Props, IState>{

    constructor(props: Props) {
        super(props);

        this.state = {
            isAuth: false,
            profile: null,
            history: createBrowserHistory({
                basename: '/reactproject'
            }),
            navBarOptions: new INavBarOptions("Main Page"),
            qrReader: ""
        }

        this.onProfileChange = this.onProfileChange.bind(this);
        this.LoginConclude = this.LoginConclude.bind(this);
        this.setNavBarOptions = this.setNavBarOptions.bind(this);
    }

    componentWillMount() {
        //get profile before mount
        Profile.Get();
    }

    componentDidMount() {
        let profile = Profile.SubscribeChanges(this.onProfileChange);
        this.onProfileChange(new CustomEvent("", { detail: profile }));
    }

    componentWillUnmount() {
        Profile.UnSubscribeChanges(this.onProfileChange);
    }

    onProfileChange(event: CustomEvent<IProfile | null>) {
        var profile = event.detail;
        this.setState({ profile });
        if (profile !== null) {
            this.setState({ isAuth: true });
        }
        else {
            this.setState({ isAuth: false });
        }
    }


    setNavBarOptions(newNavBarOptions: INavBarOptions) {
        this.setState({ navBarOptions: newNavBarOptions });
    }

    async LoginConclude() {
        var self = this;

        Profile.Get().then(() => {
            self.state.history.push({ pathname: '/profile' });
        });
    }

    render() {

        return (
            <div className="grid-container">
                <NavBar isAuth={this.state.isAuth} history={this.state.history} profile={this.state.profile} navBarOptions={this.state.navBarOptions} />
                <div className="content">
                    <Router history={this.state.history}>
                        {
                            (!this.state.isAuth) &&
                            (
                                <Route
                                    path="/signin/"
                                    render={
                                        (props: RouteComponentProps<any, StaticContext, any>) => {
                                            return (
                                                <SignInPage LoginConclude={this.LoginConclude} setNavBarOptions={this.setNavBarOptions} />
                                            )
                                        }
                                    }
                                />
                            )
                        }
                        {

                            (this.state.isAuth) &&
                            ([
                                <Route
                                    path="/profile/"
                                    render={
                                        (props: RouteComponentProps<any, StaticContext, any>) => {
                                            return (
                                                <ProfilePage setNavBarOptions={this.setNavBarOptions} />
                                            )
                                        }
                                    }
                                    key="profile"
                                />,
                                <Route
                                    path="/qrcode/"
                                    render={
                                        (props: RouteComponentProps<any, StaticContext, any>) => {
                                            return (
                                                <QrCodePage value={this.state.profile!.firstName} />
                                            )
                                        }
                                    }
                                    key="qrcode"
                                />,
                                <Route
                                    path="/qrreader/"
                                    render={
                                        (props: RouteComponentProps<any, StaticContext, any>) => {
                                            return (
                                                <QrCodeReaderPage />
                                            )
                                        }
                                    }
                                    key="qrreader"
                                />
                            ])
                        }
                    </Router>
                </div>
            </div>
        );
    }
}

export default MainPage;
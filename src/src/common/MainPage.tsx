import React from "react";
import { Router, Route, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import NavBar from "./Navigation/NavBar";
import ProfilePage from "./Account/ProfilePage";
import { INavBarOptions } from "./Navigation/INavBarOptions";
import SignInPage from "./Login/SignInBackend/SignInPage";
import IProfile from "./Account/IProfile";
import Profile from "./Backend/Profile";
import './MainPage.css';
import Settings from "./Settings";
import MainPageAdmin from "../admin/MainPageAdmin";
import MainPageUser from "../user/MainPageUser";
import MessageBar from "./MessageBar";
import AboutPage from "./About/AboutPage";
import Sessions from "./Account/Sessions";

interface IState {
    isAuth: boolean;
    profile: IProfile | null;
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

    LoginConclude() {
        Profile.Get().then(() => {
            Settings.history.push({ pathname: '/profile' });
        });
    }

    render() {

        return (
            <div className="grid-container">
                <NavBar isAuth={this.state.isAuth} profile={this.state.profile} navBarOptions={this.state.navBarOptions} />
                <div className="content">
                    <MessageBar />
                    <Router history={Settings.history}>
                        {
                            ([
                                <Route
                                    path="/about"
                                    render={
                                        (props: RouteComponentProps<any, StaticContext, any>) => {
                                            return (
                                                <AboutPage />
                                            )
                                        }
                                    }
                                    key="about"
                                />,
                                (!this.state.isAuth) &&
                                ([
                                    <Route
                                        path="/signin/"
                                        render={
                                            (props: RouteComponentProps<any, StaticContext, any>) => {
                                                return (
                                                    <SignInPage LoginConclude={this.LoginConclude} setNavBarOptions={this.setNavBarOptions} />
                                                )
                                            }
                                        }
                                        key="signin"
                                    />
                                ]),
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
                                        path="/sessions/"
                                        render={
                                            (props: RouteComponentProps<any, StaticContext, any>) => {
                                                return (
                                                    <Sessions setNavBarOptions={this.setNavBarOptions} />
                                                )
                                            }
                                        }
                                        key="sessions"
                                    />,
                                    (this.state.profile !== null) &&
                                    (
                                        [
                                            <Route
                                                path="/user/"
                                                render={
                                                    (props: RouteComponentProps<any, StaticContext, any>) => {
                                                        return (
                                                            <MainPageUser pathParent="/user" profile={this.state.profile!} />
                                                        )
                                                    }
                                                }
                                                key="user"
                                            />,
                                            (this.state.profile.isAdmin) &&
                                            (<Route
                                                path="/admin"
                                                render={
                                                    (props: RouteComponentProps<any, StaticContext, any>) => {
                                                        return (
                                                            <MainPageAdmin pathParent="/admin" />
                                                        )
                                                    }
                                                }
                                                key="admin"
                                            />)
                                        ]
                                    )
                                ])
                            ])
                        }
                    </Router>
                </div>
            </div>
        );
    }
}

export default MainPage;
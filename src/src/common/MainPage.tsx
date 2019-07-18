import React from "react";
import { Router } from "react-router-dom";
import NavBar from "./Navigation/NavBar";
import ProfilePage from "./Account/ProfilePage";
import { INavBarOptions } from "./Navigation/INavBarOptions";
import SignInPage from "./Login/SignInBackend/SignInPage";
import IProfile from "./Backend/IProfile";
import Profile from "./Backend/Profile";
import './MainPage.css';
import Settings from "./Settings";
import MainPageAdmin from "../admin/MainPageAdmin";
import MainPageUser from "../user/MainPageUser";
import MessageBar from "./MessageBar";
import Sessions from "./Account/Sessions";
import { CustomRoute } from "./Helpers/CustomRoute";

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

    async componentWillMount() {
        await Profile.Get();

        if (window.location.pathname === "/" || window.location.pathname === "/reactproject" || window.location.pathname === "/reactproject/")
            Settings.history.push({ pathname: '/user' });
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

    async LoginConclude(isNewAccount: Boolean) {
        await Profile.Get();
        if (!isNewAccount) {
            Settings.history.push({ pathname: '/user' });
        }
        else {
            Settings.history.push({ pathname: '/profile' });
        }
    }

    render() {

        return (
            <div className="grid-container">
                <NavBar isAuth={this.state.isAuth} profile={this.state.profile} navBarOptions={this.state.navBarOptions} />
                <div className="content">
                    <MessageBar />
                    <Router history={Settings.history}>
                        <CustomRoute uniquePath="/signin/" showRender={!this.state.isAuth}>
                            <SignInPage LoginConclude={this.LoginConclude} setNavBarOptions={this.setNavBarOptions} />
                        </CustomRoute>
                        <CustomRoute uniquePath="/profile/" showRender={this.state.isAuth}>
                            <ProfilePage setNavBarOptions={this.setNavBarOptions} />
                        </CustomRoute>
                        <CustomRoute uniquePath="/sessions/" showRender={this.state.isAuth}>
                            <Sessions setNavBarOptions={this.setNavBarOptions} />
                        </CustomRoute>
                        <CustomRoute uniquePath="/user/" showRender={this.state.isAuth && this.state.profile !== null}>
                            <MainPageUser pathParent="/user" profile={this.state.profile!} setNavBarOptions={this.setNavBarOptions} />
                        </CustomRoute>
                        <CustomRoute uniquePath="/admin/" showRender={this.state.isAuth && this.state.profile !== null && this.state.profile.isAdmin}>
                            <MainPageAdmin pathParent="/admin" setNavBarOptions={this.setNavBarOptions} />
                        </CustomRoute>
                    </Router>
                </div>
            </div>
        );
    }
}

export default MainPage;
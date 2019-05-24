import { History } from "history";
import React from "react";
import { INavBarOptions } from "./INavBarOptions";
import IProfile from "../Profile/IProfile";
import AuthBackend from "../Backend/Auth";
import { IPersonaSharedProps, PersonaSize, Persona } from "office-ui-fabric-react/lib/Persona";
import { DefaultButton, CommandButton, IconButton } from "office-ui-fabric-react/lib/Button";
import './NavBar.css'
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { CommunicationColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';
import { IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";

interface IProps {
    navBarOptions: INavBarOptions
    profile: IProfile | null;
    isAuth: boolean;
    history: History<any>;
}

interface IState {
}

class NavBar extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            anchorEl: null
        }


        this.handleRequestGoBack = this.handleRequestGoBack.bind(this);
        this.handleRequestToSignIn = this.handleRequestToSignIn.bind(this);
        this.openProfilePage = this.openProfilePage.bind(this);
        this.openAdminMainPage = this.openAdminMainPage.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    handleRequestGoBack() {
        this.props.history.goBack();
    }

    handleRequestToSignIn(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.props.history.push({ pathname: '/signin' });
    }

    openProfilePage() {
        this.props.history.push({ pathname: '/profile' });
    }

    openAdminMainPage() {
        this.props.history.push({ pathname: '/admin' });
    }

    signOut() {
        this.setState({ anchorEl: null });
        AuthBackend.SignOut();
    }

    render() {
        let persona: IPersonaSharedProps = {}

        let menu: IContextualMenuItem[] = [
            {
                key: 'profile',
                text: 'Profile',
                onClick: this.openProfilePage
            },
            {
                key: 'signout',
                text: 'SignOut',
                onClick: this.signOut
            }
        ]

        if (this.props.profile != null) {
            persona = {
                imageInitials: this.props.profile!.firstName.charAt(0),
                text: this.props.profile!.firstName
            }

            if (this.props.profile.isAdmin) {
                menu.splice(1, 0, {
                    key: 'admin',
                    text: "Admin",
                    onClick: this.openAdminMainPage
                });
            }
        }

        return (
            <div className="bottomBar" style={{ boxShadow: Depths.depth16, color: CommunicationColors.primary }}>
                <div className="backButton">
                    {
                        (this.props.navBarOptions.backButton) &&
                        (
                            <IconButton
                                className="arrowButton"
                                iconProps={{ iconName: 'Back' }}
                                onClick={this.handleRequestGoBack}
                            />
                        )
                    }
                </div>
                <div className="title" style={{ fontSize: FontSizes.size16 }}>
                    <h2>
                        {this.props.navBarOptions.title}
                    </h2>
                </div>
                <div className="profileNavBar">
                    {
                        (this.props.isAuth && this.props.profile != null) ?
                            (
                                <CommandButton
                                    className="profileNavBarButton"
                                    menuProps={{
                                        shouldFocusOnMount: true,
                                        items: menu
                                    }}
                                >
                                    <Persona
                                        {...persona}
                                        size={PersonaSize.size40}
                                    />
                                </CommandButton>
                            ) :
                            (
                                <DefaultButton
                                    className="profileNavBarButton"
                                    text="Sign In"
                                    iconProps={{ iconName: 'AddFriend' }}
                                    onClick={this.handleRequestToSignIn}
                                />
                            )
                    }
                </div>
            </div>
        );
    }
}

export default NavBar;
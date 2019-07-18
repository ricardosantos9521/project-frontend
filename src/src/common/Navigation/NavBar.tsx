import React from "react";
import { INavBarOptions } from "./INavBarOptions";
import IProfile from "../Backend/IProfile";
import AuthBackend from "../Backend/Auth";
import { IPersonaSharedProps, PersonaSize, Persona } from "office-ui-fabric-react/lib/Persona";
import { DefaultButton, CommandButton } from "office-ui-fabric-react/lib/Button";
import './NavBar.css'
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { CommunicationColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';
import { IContextualMenuItem, ContextualMenuItemType } from "office-ui-fabric-react/lib/ContextualMenu";
import Settings from "../Settings";

interface IProps {
    navBarOptions: INavBarOptions
    profile: IProfile | null;
    isAuth: boolean;
}

interface IState {
    mode: "admin" | "user" | "common"
}

class NavBar extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            mode: "user"
        }

        this.handleRequestGoBack = this.handleRequestGoBack.bind(this);
        this.handleRequestToSignIn = this.handleRequestToSignIn.bind(this);

        Settings.history.listen((p) => {
            let path_aux = (p.pathname.charAt(0) === '/') ? (p.pathname.slice(1, p.pathname.length)) : p.pathname;
            let path: string[] = path_aux.split("/");
            switch (path[0]) {
                case "admin":
                    this.setState({ mode: "admin" });
                    break;
                case "user":
                    this.setState({ mode: "user" });
                    break;
                default:
                    this.setState({ mode: "common" });
                    break;
            }
        })
    }

    handleRequestGoBack() {
        Settings.history.goBack();
    }

    handleRequestToSignIn(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        Settings.history.push({ pathname: '/signin' });
    }

    render() {
        let persona: IPersonaSharedProps = {}

        let menu: IContextualMenuItem[] = [
            {
                key: 'profile',
                text: 'Profile',
                onClick: () => { Settings.history.push({ pathname: '/profile' }); }
            },
            {
                key: 'sessions',
                text: 'Sessions',
                onClick: () => { Settings.history.push({ pathname: '/sessions' }); }
            },
            {
                key: 'divider_1',
                itemType: ContextualMenuItemType.Divider
            },
            {
                key: 'divider_2',
                itemType: ContextualMenuItemType.Divider
            },
            {
                key: 'signout',
                text: 'SignOut',
                onClick: async () => { await AuthBackend.SignOut(); }
            }
        ]

        if (this.props.profile != null) {
            persona = {
                imageInitials: this.props.profile!.firstName.charAt(0),
                text: this.props.profile!.firstName
            }

            if (this.state.mode !== "user") {
                menu.splice(3, 0, {
                    key: 'user',
                    text: "User",
                    onClick: () => {
                        Settings.history.push({ pathname: '/user' });
                    }
                });
            }

            if (this.props.profile.isAdmin && (this.state.mode !== "admin")) {
                menu.splice(3, 0, {
                    key: 'admin',
                    text: "Admin",
                    onClick: () => {
                        Settings.history.push({ pathname: '/admin' });
                    }
                });
            }
        }

        return (
            <div className="bottomBar" style={{ boxShadow: Depths.depth16, color: CommunicationColors.primary }}>
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
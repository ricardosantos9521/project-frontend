import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import QrCodePage from "../common/QRCode/QRCodePage";
import IProfile from "../common/Account/IProfile";
import NavigationPage, { MenuItem } from "../common/UIPages/NavigationPage";
import Settings from "../common/Settings";

interface IProps {
    pathParent: string,
    profile: IProfile
}

class MainPageUser extends React.Component<IProps>{

    render() {
        let items: Array<MenuItem> = [
            {
                icon: "qrcode",
                name: "QRCode",
                onClick: () => {
                    Settings.history.push({ pathname: '/user/qrcode' });
                }
            }
        ];

        let overflowItems: Array<MenuItem> = [

        ];

        return (
            <div className="user-container" style={{ width: "100%", height: "100%" }}>
                <NavigationPage items={items} overflowItems={overflowItems}>
                    <Route
                        path={this.props.pathParent + "/qrcode"}
                        render={
                            (props: RouteComponentProps<any, StaticContext, any>) => {
                                return (
                                    <QrCodePage value={this.props.profile.firstName} />
                                )
                            }
                        }
                        key="qrcode"
                    />
                </NavigationPage>
            </div>
        );
    }
}

export default MainPageUser;
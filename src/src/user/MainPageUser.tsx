import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import QrCodePage from "../common/QRCode/QRCodePage";
import IProfile from "../common/Profile/IProfile";

interface IProps {
    pathParent: string,
    profile: IProfile
}

class MainPageUser extends React.Component<IProps>{

    render() {
        return (
            <div className="user-container">
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
            </div>
        );
    }
}

export default MainPageUser;
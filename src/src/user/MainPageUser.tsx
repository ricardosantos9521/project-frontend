import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import QrCodePage from "../common/QRCode/QRCodePage";
import IProfile from "../common/Account/IProfile";
import NavigationPage, { MenuItem } from "../common/UIPages/NavigationPage";
import Settings from "../common/Settings";
import UploadFile from "../common/File/UploadFile";
import Files from "../common/File/Files";
import { INavBarOptions } from "../common/Navigation/INavBarOptions";

interface IProps {
    pathParent: string,
    profile: IProfile,
    setNavBarOptions?(newNavBarOptions: INavBarOptions): void
}

class MainPageUser extends React.Component<IProps>{

    constructor(props: IProps) {
        super(props);

        this.props.setNavBarOptions!(new INavBarOptions("User Page"));
    }

    render() {
        let items: Array<MenuItem> = [
            {
                icon: "qrcode",
                name: "QRCode",
                onClick: () => {
                    Settings.history.push({ pathname: '/user/qrcode' });
                }
            },
            {
                icon: "CloudUpload",
                name: "Upload",
                onClick: () => {
                    Settings.history.push({ pathname: '/user/upload' });
                }
            },
            {
                icon: "FolderOpen",
                name: "Files",
                onClick: () => {
                    Settings.history.push({ pathname: '/user/files' });
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
                                    <QrCodePage value={this.props.profile.email} setNavBarOptions={this.props.setNavBarOptions} />
                                )
                            }
                        }
                        key="qrcode"
                    />
                    <Route
                        path={this.props.pathParent + "/upload"}
                        render={
                            (props: RouteComponentProps<any, StaticContext, any>) => {
                                return (
                                    <UploadFile setNavBarOptions={this.props.setNavBarOptions} />
                                )
                            }
                        }
                        key="upload"
                    />
                    <Route
                        path={this.props.pathParent + "/files"}
                        render={
                            (props: RouteComponentProps<any, StaticContext, any>) => {
                                return (
                                    <Files setNavBarOptions={this.props.setNavBarOptions} />
                                )
                            }
                        }
                        key="files"
                    />
                </NavigationPage>
            </div>
        );
    }
}

export default MainPageUser;
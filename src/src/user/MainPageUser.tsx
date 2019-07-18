import React from "react";
import QrCodePage from "./QRCodePage";
import IProfile from "../common/Account/IProfile";
import NavigationPage, { MenuItem } from "../common/UIPages/NavigationPage";
import Settings from "../common/Settings";
import UploadFile from "../common/File/UploadFile";
import Files from "../common/File/Files";
import { INavBarOptions } from "../common/Navigation/INavBarOptions";
import { CustomRoute } from "../common/Helpers/CustomRoute";

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
                    <CustomRoute uniquePath={this.props.pathParent + "/qrcode"}>
                        <QrCodePage value={this.props.profile.email} setNavBarOptions={this.props.setNavBarOptions} />
                    </CustomRoute>
                    <CustomRoute uniquePath={this.props.pathParent + "/upload"}>
                        <UploadFile setNavBarOptions={this.props.setNavBarOptions} />
                    </CustomRoute>
                    <CustomRoute uniquePath={this.props.pathParent + "/files"}>
                        <Files setNavBarOptions={this.props.setNavBarOptions} />
                    </CustomRoute>
                </NavigationPage>
            </div>
        );
    }
}

export default MainPageUser;
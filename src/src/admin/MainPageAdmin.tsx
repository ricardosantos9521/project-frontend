import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import QrCodeReaderPage from "../common/QRCode/QRCodeReaderPage";
import NavigationPage, { MenuItem } from "../common/UIPages/NavigationPage";
import Settings from "../common/Settings";
import { INavBarOptions } from "../common/Navigation/INavBarOptions";

interface IProps {
    pathParent: string,
    setNavBarOptions?(newNavBarOptions: INavBarOptions): void
}

class MainPageAdmin extends React.Component<IProps>{

    constructor(props: IProps) {
        super(props);

        this.props.setNavBarOptions!(new INavBarOptions("Admin Page"));
    }

    render() {
        let items: Array<MenuItem> = [
            {
                icon: "qrcode",
                name: "QRCode",
                onClick: () => {
                    Settings.history.push({ pathname: '/admin/qrreader' });
                }
            }
        ];

        let overflowItems: Array<MenuItem> = [

        ];

        return (
            <div className="admin-container" style={{ width: "100%", height: "100%" }}>
                <NavigationPage items={items} overflowItems={overflowItems}>
                    <Route
                        path={this.props.pathParent + "/qrreader"}
                        render={
                            (props: RouteComponentProps<any, StaticContext, any>) => {
                                return (
                                    <QrCodeReaderPage />
                                )
                            }
                        }
                        key="qrreader"
                    />
                </NavigationPage>
            </div>
        );
    }
}

export default MainPageAdmin;
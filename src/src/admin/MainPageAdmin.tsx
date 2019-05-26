import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import QrCodeReaderPage from "../common/QRCode/QRCodeReaderPage";

interface IProps {
    pathParent: string
}

class MainPageAdmin extends React.Component<IProps>{

    render() {
        return (
            <div className="admin-container" style={{ width: "100%", height: "100%" }}>
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
            </div>
        );
    }
}

export default MainPageAdmin;
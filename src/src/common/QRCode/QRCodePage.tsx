import React from "react";
import QRCode from "./QRCode";
import CardPage from "../UIPages/CardPage";
import { INavBarOptions } from "../Navigation/INavBarOptions";

interface IProps {
    value: string,
    setNavBarOptions?(newNavBarOptions: INavBarOptions): void
}

class QrCodePage extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);

        this.props.setNavBarOptions!(new INavBarOptions("QRCode"));
    }
    
    render() {
        return (
            <CardPage widthCard="400px">
                <div className="qrcodepage">
                    <QRCode value={this.props.value} />
                </div>
            </CardPage>
        );
    }
}

export default QrCodePage;
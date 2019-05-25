import React from "react";
import QRCode from "./QRCode";
import CardPage from "../UIPages/CardPage";

interface IProps {
    value: string
}

class QrCodePage extends React.Component<IProps> {
    render() {
        return (
            <CardPage>
                <div className="qrcodepage">
                    <QRCode value={this.props.value} />
                </div>
            </CardPage>
        );
    }
}

export default QrCodePage;
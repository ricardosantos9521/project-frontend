import React from "react";
import QRCode from "./QRCode";
import './QRCodePage.css'

interface IProps {
    value: string
}

class QrCodePage extends React.Component<IProps> {
    render() {
        return (
            <div className="qrcodecontainer">
                <QRCode value={this.props.value} />
            </div>
        );
    }
}

export default QrCodePage;
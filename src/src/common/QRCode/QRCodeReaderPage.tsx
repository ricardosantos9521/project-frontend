import React from "react";
import QRCodeReader from "./QRCodeReader";
import './QRCodeReaderPage.css'

interface IProps {

}

interface IState {
    qrCodeString: string
}

class QrCodeReaderPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            qrCodeString: ""
        }

        this.onScan = this.onScan.bind(this);
    }

    onScan(data: string) {

    }

    render() {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <div className="qrcodereadercontainer">
                    <QRCodeReader onScan={this.onScan} />
                    <h2>{this.state.qrCodeString}</h2>
                </div>
            </div>
        );
    }
}

export default QrCodeReaderPage;
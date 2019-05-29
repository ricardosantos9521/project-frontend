import React from "react";
import QRCodeReader from "./QRCodeReader";
import './QRCodeReaderPage.css'
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import CardPage from "../UIPages/CardPage";

interface IProps {

}

interface IState {
    qrCodeString: string,
    scan: boolean
}

class QrCodeReaderPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            qrCodeString: "",
            scan: false
        }

        this.onScan = this.onScan.bind(this);
        this.onClickScan = this.onClickScan.bind(this);
    }

    onScan(data: string) {
        window.navigator.vibrate(200);
        this.setState({ qrCodeString: data });
    }

    onClickScan() {
        this.setState({ scan: true })
    }

    render() {
        return (
            <CardPage widthCard="400px">
                    <QRCodeReader
                        onScan={this.onScan}
                        scan={this.state.scan}
                    />
                    <h2>{this.state.qrCodeString}</h2>
                    {
                        (!this.state.scan) &&
                        (<DefaultButton
                            className="buttonScanQRReader"
                            text="Scan"
                            onClick={this.onClickScan}
                        />)
                    }
            </CardPage>
        );
    }
}

export default QrCodeReaderPage;
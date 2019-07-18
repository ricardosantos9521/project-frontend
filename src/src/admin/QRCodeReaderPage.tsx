import React from "react";
import QRCodeReader from "../common/QRCode/QRCodeReader";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import Stack from "office-ui-fabric-react/lib/components/Stack/Stack";
import './QRCodeReaderPage.css'

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
            <Stack tokens={{ childrenGap: 20 }} verticalAlign="center" horizontalAlign="center" styles={{ root: { height: "100%" } }}>
                <div className="qrcode">
                    <QRCodeReader
                        onScan={this.onScan}
                        scan={this.state.scan}
                    />
                    {
                        (!this.state.scan) &&
                        (<DefaultButton
                            className="buttonScanQRReader"
                            text="Scan"
                            onClick={this.onClickScan}
                        />)
                    }
                    {
                        (this.state.qrCodeString !== "") &&
                        (
                            <p className="readCode">
                                {this.state.qrCodeString}
                            </p>
                        )
                    }
                </div>
            </Stack>
        );
    }
}

export default QrCodeReaderPage;
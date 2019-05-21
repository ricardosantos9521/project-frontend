import React from "react";
import QrReader from "react-qr-reader";

interface IProps {
    onScan(data: string): void
}

class QRCodeReader extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);

        this.onScan = this.onScan.bind(this);
        this.onError = this.onError.bind(this);
    }

    onScan(data: string | null) {
        console.log(data);
        if (data !== null) {
            this.props.onScan(data!);
        }
    }

    onError(err: any) {
        console.log(err);
    }

    render() {
        return (
            <QrReader
                facingMode="user"
                delay={false}
                onError={this.onError}
                onScan={this.onScan}
                style={{ width: '50%' }}
            />
        );
    }
}

export default QRCodeReader;
import React from "react";
import QRCodeReact from 'qrcode.react'

interface IProps {
    value: string
}

class QRCode extends React.Component<IProps> {

    render() {
        return (
            <QRCodeReact
                value={this.props.value}
                renderAs="svg"
                level="L"
                size={400}
            />
        );
    }
}

export default QRCode;
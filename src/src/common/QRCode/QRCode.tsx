import React from "react";
import QRCodeReact from 'qrcode.react'

interface IProps {
    value: string
}

class QRCode extends React.Component<IProps> {

    render() {
        return (
            <QRCodeReact
                {...{ style: { width: "100%", height: "auto" } }}
                value={this.props.value}
                renderAs="svg"
                level="L"
            />
        );
    }
}

export default QRCode;
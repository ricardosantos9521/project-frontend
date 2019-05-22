import React from "react";
import QRCode from 'qrcode.react'

interface IProps {
    value: string
}

class QRCodeGenerator extends React.Component<IProps> {

    render() {
        return (
            <div style={{ margin: "20px" }}>
                <QRCode
                    value={this.props.value}
                    renderAs="svg"
                    level="L"
                    size={300}
                />
            </div>
        );
    }
}

export default QRCodeGenerator;
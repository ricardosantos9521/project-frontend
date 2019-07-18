import React from "react";
import QRCode from "../common/QRCode/QRCode";
import { INavBarOptions } from "../common/Navigation/INavBarOptions";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import './QRCodePage.css'

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
            <Stack tokens={{ childrenGap: 20 }} verticalAlign="center" horizontalAlign="center" styles={{ root: { height: "100%" } }}>
                <div className="qrcode">
                    <QRCode value={this.props.value} />
                </div>
            </Stack>
        );
    }
}

export default QrCodePage;
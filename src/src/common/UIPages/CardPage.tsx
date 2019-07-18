import React from "react";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import SpinnerComponent from "./SpinnerComponent";

interface IProps {
    isLoading?: boolean,
    loadingMessage?: string
}

class CardPage extends React.Component<IProps> {
    render() {
        if (this.props.isLoading!)
            return (<SpinnerComponent isLoading={this.props.isLoading} loadingMessage={this.props.loadingMessage} />)

        return (
            <Stack tokens={{ childrenGap: 20 }} verticalAlign="center" horizontalAlign="center" styles={{ root: { height: "100%" } }}>
                <div className="card" style={{ boxShadow: Depths.depth64, position: "relative" }}>
                    {this.props.children}
                </div>
            </Stack>
        )
    }
}

export default CardPage;
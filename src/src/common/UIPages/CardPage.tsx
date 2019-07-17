import React from "react";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Stack } from "office-ui-fabric-react/lib/Stack";

interface IProps {
    isLoading?: boolean,
    loadingMessage?: string,
    widthCard?: string | number | undefined
}

class CardPage extends React.Component<IProps> {
    render() {
        return (
            <Stack className="files" tokens={{ childrenGap: 20 }} horizontal disableShrink wrap horizontalAlign="center" style={{ height: "100%" }} verticalAlign={(this.props.isLoading!) ? "start" : "center"}>
                {
                    (this.props.isLoading!) ?
                        (
                            <Spinner size={SpinnerSize.large} />
                        ) :
                        (
                            <div style={{ boxShadow: Depths.depth64, width: this.props.widthCard, position: "absolute" }}>
                                {this.props.children}
                            </div>
                        )
                }
            </Stack>
        )
    }
}

export default CardPage;
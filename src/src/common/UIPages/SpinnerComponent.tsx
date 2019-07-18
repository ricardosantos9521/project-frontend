import { Stack } from "office-ui-fabric-react/lib/Stack";
import React from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Label } from "office-ui-fabric-react/lib/Label";

interface IProps {
    isLoading?: Boolean,
    loadingMessage?: string
}

class SpinnerComponent extends React.Component<IProps> {
    render() {
        return (
            <Stack tokens={{ childrenGap: 20 }} horizontal disableShrink wrap horizontalAlign="center" style={{ margin: "25px" }}>
                {
                    (this.props.isLoading!) &&
                    (
                        <div>
                            <Spinner size={SpinnerSize.large} />
                            {
                                (this.props.loadingMessage !== undefined) &&
                                (<Label>{this.props.loadingMessage!}</Label>)
                            }
                        </div>
                    )
                }
            </Stack>
        )
    }
}

export default SpinnerComponent;
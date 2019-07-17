import React from "react";
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import './CardPage.css'

interface IProps {
    isLoading?: boolean,
    loadingMessage?: string,
    widthCard?: string | number | undefined
}

class CardPage extends React.Component<IProps> {
    render() {
        return (
            <Stack tokens={{ childrenGap: 20 }} verticalAlign="center" horizontalAlign="center" styles={{ root: { height: "100%" } }}>
                {
                    (this.props.isLoading!) ?
                        (
                            <Spinner size={SpinnerSize.large} />
                        ) :
                        (
                            <div className="card" style={{ boxShadow: Depths.depth64, width: this.props.widthCard, position: "relative" }}>
                                {this.props.children}
                            </div>
                        )
                }
            </Stack>
        )
    }
}

export default CardPage;
import React from "react";
import './CardPage.css'
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

interface IProps {
    isLoading?: boolean,
    widthCard?: string | number | undefined
}

class CardPage extends React.Component<IProps> {
    render() {
        return (
            <div className="cardpage">
                {
                    (!this.props.isLoading || this.props.isLoading === undefined) ?
                        (<div className="cardcenter" style={{ boxShadow: Depths.depth64, width: this.props.widthCard }}>
                            <div className="cardContent">
                                {this.props.children}
                            </div>
                        </div>) :
                        (
                            <div className="cardcenter">
                                <Spinner size={SpinnerSize.large} />
                            </div>
                        )
                }
            </div>
        )
    }
}

export default CardPage;
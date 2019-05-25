import React from "react";
import './CardPage.css'
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

interface IProps {
    isLoading: boolean
}

class CardPage extends React.Component<IProps> {
    render() {
        return (
            <div className="cardpage">
                {
                    (!this.props.isLoading) ?
                        (<div className="card" style={{ boxShadow: Depths.depth64 }}>
                            <div className="cardContent">
                                {this.props.children}
                            </div>
                        </div>) :
                        (
                            <div className="centercard">
                                <Spinner size={SpinnerSize.large} />
                            </div>
                        )
                }
            </div>
        )
    }
}

export default CardPage;
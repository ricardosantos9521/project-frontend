import React, { ReactElement } from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import { Label } from "office-ui-fabric-react/lib/Label";
import { Stack } from "office-ui-fabric-react/lib/Stack";

export interface IProps {
    uniquePath: string,
    showRender?: boolean
}

export class CustomRoute extends React.Component<IProps>{
    render() {
        return (
            < Route
                path={this.props.uniquePath}
                render={
                    (props: RouteComponentProps<any, StaticContext, any>) => {
                        if (this.props.showRender === undefined || this.props.showRender!)
                            return React.Children.map(this.props.children, child => {
                                return React.cloneElement(child as ReactElement<any>, { routeProps: props });
                            });
                        else
                            return (
                                <Stack horizontalAlign="center" verticalAlign="center" style={{ height: "100%" }}>
                                    <Label>
                                        Not found
                                    </Label>
                                </Stack>
                            );
                    }
                }
                key={this.props.uniquePath}
            />
        )
    }
}
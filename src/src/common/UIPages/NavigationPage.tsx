import React from 'react';
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { TooltipHost, DirectionalHint } from 'office-ui-fabric-react/lib/Tooltip';
import { IOverflowSetItemProps, OverflowSet } from 'office-ui-fabric-react/lib/OverflowSet';
import './NavigationPage.css'

interface IProps {
    items: Array<MenuItem>,
    overflowItems: Array<MenuItem>
}

export interface MenuItem {
    icon: string,
    name: string,
    onClick: any
}

class NavigationPage extends React.Component<IProps> {

    private _onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
        return (
            <TooltipHost content={item.name} calloutProps={{ directionalHint: DirectionalHint.rightCenter, beakWidth: 12 }}>
                <CommandBarButton styles={{ root: { padding: '15px' } }} iconProps={{ iconName: item.icon }} onClick={item.onClick} />
            </TooltipHost>
        );
    };

    private _onRenderOverflowButton = (overflowItems: any[] | undefined): JSX.Element => {
        return (
            <CommandBarButton
                styles={{ root: { padding: '15px' }, menuIcon: { fontSize: '16px' } }}
                menuIconProps={{ iconName: 'More' }}
                menuProps={{ items: overflowItems! }}
            />
        );
    };

    render() {
        let i = 0;

        return (
            <div className="navigationPage">
                <OverflowSet
                    className="navigationPageOverflow"
                    vertical
                    items={
                        this.props.items.map(x => {
                            return (
                                {
                                    key: 'item' + i++,
                                    icon: x.icon,
                                    name: x.name,
                                    onClick: x.onClick
                                }
                            );
                        })
                    }
                    overflowItems={
                        this.props.overflowItems.map(x => {
                            return (
                                {
                                    key: 'item' + i++,
                                    icon: x.icon,
                                    name: x.name,
                                    onClick: x.onClick
                                }
                            );
                        })
                    }
                    onRenderOverflowButton={this._onRenderOverflowButton}
                    onRenderItem={this._onRenderItem}
                />
                <div className="navigationPageContainer">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default NavigationPage;
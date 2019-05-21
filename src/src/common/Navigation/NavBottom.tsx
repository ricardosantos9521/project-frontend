import React from "react";
import { History } from "history";
import './NavBottom.css'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';



interface IProps {
    isAuth: boolean;
    history: History<any>;
}

interface IState {
}

class NavBottom extends React.Component<IProps, IState> {

    getItems() {
        return [
            {
                key: 'recents',
                name: 'Recentes',
                iconProps: {
                    iconName: 'Upload'
                },
                href: 'https://dev.office.com/fabric'
            },
            {
                key: 'favorites',
                name: 'Favorites',
                iconProps: {
                    iconName: 'Upload'
                },
                href: 'https://dev.office.com/fabric'
            },
            {
                key: 'nearby',
                name: 'Nearby',
                iconProps: {
                    iconName: 'Upload'
                },
                href: 'https://dev.office.com/fabric'
            }
        ];
    }

    render() {
        if (this.props.isAuth) {
            return (
                <CommandBar
                    className="bottomnavigation"
                    items={this.getItems()}
                />
            );
        }
        return null;
    }
}

export default NavBottom;
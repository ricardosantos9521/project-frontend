import React from "react";

import { MessageBar as MessageBarFabricUI, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

interface IState {
    errorMessage: string | null
}


class MessageBar extends React.Component<any, IState> {

    private static messageBar: MessageBar | null;

    public static setMessage(errorMessage: string) {
        if (this.messageBar != null) {
            this.messageBar.setMessage(errorMessage);
        }
    }

    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: null
        }

        this.closeMessage = this.closeMessage.bind(this);
    }

    componentWillUnmount() {
        MessageBar.messageBar = null;
    }

    componentDidMount() {
        MessageBar.messageBar = this;
    }

    setMessage(errorMessage: string) {
        this.setState({ errorMessage });
    }

    closeMessage() {
        this.setState({ errorMessage: null });
    }

    render() {
        if (this.state.errorMessage !== null)
            return (
                <MessageBarFabricUI messageBarType={MessageBarType.error} isMultiline={false} onDismiss={this.closeMessage} dismissButtonAriaLabel="Close">
                    {this.state.errorMessage!}
                </MessageBarFabricUI>
            );
        else
            return null;
    }
}

export default MessageBar;
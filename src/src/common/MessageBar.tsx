import React from "react";

import { MessageBar as MessageBarFabricUI, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

interface IState {
    errorMessage: string | null,
}

class MessageBar extends React.Component<any, IState> {

    private static messageBar: MessageBar | null;

    private static lastTimeout: NodeJS.Timeout | null = null;

    public static setMessage(errorMessage: string, isPersistent: boolean = false) {
        if (this.messageBar != null) {
            if (this.lastTimeout !== null) {
                clearTimeout(this.lastTimeout);
            }

            this.messageBar!.setMessage(errorMessage);

            this.lastTimeout = null;

            if (!isPersistent) {
                this.lastTimeout = setTimeout(() => {
                    this.messageBar!.closeMessage();
                }, 20000);
            }
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
                <MessageBarFabricUI 
                    messageBarType={MessageBarType.error} 
                    isMultiline={true} 
                    onDismiss={this.closeMessage} 
                    dismissButtonAriaLabel="Close"
                >
                    {this.state.errorMessage!}
                </MessageBarFabricUI>
            );
        else
            return null;
    }
}

export default MessageBar;
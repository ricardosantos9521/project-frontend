import React from 'react';
import Auth from '../Backend/Auth';
import Settings from '../Settings';
import { DocumentCard, DocumentCardType, DocumentCardActions, DocumentCardTitle, DocumentCardDetails } from 'office-ui-fabric-react/lib/DocumentCard';
import { Label } from 'office-ui-fabric-react/lib/Label';
import './Sessions.css'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import HandleResponsesXHR from '../Helper/HandleResponsesXHR';

export interface ISession {
    sessionId: string,
    uniqueId: string,
    firstLogin: string,
    lastLogin: string
}

interface IProps {
    session: ISession
}

interface IState {
    showSessionCard: boolean,
    showSessionDeleteDialog: boolean
}

class CardSession extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.state = {
            showSessionCard: true,
            showSessionDeleteDialog: false
        }

        this.showSessionDeleteDialog = this.showSessionDeleteDialog.bind(this);
        this.closeSessionDeleteDialog = this.closeSessionDeleteDialog.bind(this);
        this.deleteSession = this.deleteSession.bind(this);
    }

    private showSessionDeleteDialog() {
        this.setState({ showSessionDeleteDialog: true });
    }

    private closeSessionDeleteDialog() {
        this.setState({ showSessionDeleteDialog: false });
    }

    async deleteSession() {
        var self = this;

        var accessToken = await Auth.GetAccessToken();
        if (accessToken != null) {

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    self.setState({ showSessionDeleteDialog: false });
                    
                    HandleResponsesXHR.handleOkResponse(this, (r) => {
                        self.setState({ showSessionCard: false });
                    });

                    HandleResponsesXHR.handleBadRequest(this);

                    HandleResponsesXHR.handleCannotAccessServer(this);

                    HandleResponsesXHR.handleUnauthorized(this);

                    HandleResponsesXHR.handleNotAcceptable(this);
                }
            });

            xhr.open("POST", Settings.serverUrl + "/api/session/delete");
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken!.token);
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(this.props.session.sessionId));
        }
    }

    render() {
        return (
            (this.state.showSessionCard) ?
                (
                    <div>
                        <DocumentCard type={DocumentCardType.normal} styles={{ root: { margin: "auto" } }}>
                            <DocumentCardTitle title={this.props.session.sessionId} showAsSecondaryTitle />
                            <DocumentCardDetails styles={{ root: { textAlign: "center" } }}>
                                First login:
                                    <Label>{new Date(this.props.session.firstLogin).toLocaleString()}</Label>
                                Last token request:
                                    <Label>{new Date(this.props.session.lastLogin).toLocaleString()}</Label>
                            </DocumentCardDetails>
                            <DocumentCardActions
                                actions={[{
                                    iconProps: { iconName: 'Delete' },
                                    onClick: this.showSessionDeleteDialog,
                                    ariaLabel: 'Delete session'
                                }]}
                            />
                        </DocumentCard>
                        <Dialog
                            hidden={!this.state.showSessionDeleteDialog}
                            onDismiss={this.closeSessionDeleteDialog}
                            dialogContentProps={{
                                type: DialogType.normal,
                                title: 'Delete Session',
                                subText: "Are you sure you want to delete session '" + this.props.session.sessionId + "'?"
                            }}
                            modalProps={{
                                isBlocking: true,
                                styles: { main: { maxWidth: 450 } }
                            }}
                        >
                            <DialogFooter>
                                <PrimaryButton onClick={async () => { this.deleteSession() }} text="Yes" />
                                <DefaultButton onClick={this.closeSessionDeleteDialog} text="No" />
                            </DialogFooter>
                        </Dialog>
                    </div>
                ) :
                null
        );
    }
}

export default CardSession;
import React from 'react';
import { INavBarOptions } from '../Navigation/INavBarOptions';
import Auth from '../Backend/Auth';
import Settings from '../Settings';
import MessageBar from '../MessageBar';
import { ErrorMessages } from '../ErrorMessages';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { DocumentCard, DocumentCardType, DocumentCardActions, DocumentCardTitle } from 'office-ui-fabric-react/lib/DocumentCard';
import { Label } from 'office-ui-fabric-react/lib/Label';

interface Session {
    sessionId: string,
    uniqueId: string,
    firstLogin: string,
    lastLogin: string
}

interface IProps {
    setNavBarOptions?(newNavBarOptions: INavBarOptions): void
}

interface IState {
    sessions: Array<Session>,
    isLoading: boolean
}

class SessionsPage extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.state = {
            sessions: [],
            isLoading: true
        }

        this.props.setNavBarOptions!(new INavBarOptions("Sessions", false));

        this.getSessions();
    }

    async getSessions() {
        var self = this;

        var accessToken = await Auth.GetAcessToken();
        if (accessToken != null) {

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {

                if (this.readyState !== 4) return;

                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var sessions: Array<Session> = JSON.parse(this.response);
                        self.setState({ sessions: sessions, isLoading: false });
                    }
                    else if (this.status === 404 || this.status === 0) {
                        MessageBar.setMessage(ErrorMessages.CannotAcessServer);
                    }
                    else {
                        MessageBar.setMessage(this.responseText);
                    }
                }
            });

            xhr.open("GET", Settings.serverUrl + "/api/session/sessions");
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken!.token);

            xhr.send(null);
        }
    }

    async deleteSession(sessionId: string) {
        var self = this;

        var accessToken = await Auth.GetAcessToken();
        if (accessToken != null) {

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {

                if (this.readyState !== 4) return;

                if (this.readyState === 4) {
                    if (this.status === 200) {
                        self.setState({ sessions: [], isLoading: true });
                        self.getSessions();
                    }
                    else if (this.status === 404 || this.status === 0) {
                        MessageBar.setMessage(ErrorMessages.CannotAcessServer);
                    }
                    else {
                        MessageBar.setMessage(this.responseText);
                    }
                }
            });

            xhr.open("POST", Settings.serverUrl + "/api/session/delete");
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken!.token);
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(sessionId));
        }
    }

    render() {
        return (
            <Stack tokens={{ childrenGap: 20 }}>
                {
                    this.state.sessions.map((session, key) => {
                        return (
                            <DocumentCard type={DocumentCardType.normal} key={key}>
                                <DocumentCardTitle title={session.sessionId} />
                                First login:
                                <Label>{new Date(session.firstLogin).toLocaleString()}</Label>
                                Last token request:
                                <Label>{new Date(session.lastLogin).toLocaleString()}</Label>
                                <DocumentCardActions
                                    actions={[{
                                        iconProps: { iconName: 'Delete' },
                                        onClick: () => this.deleteSession(session.sessionId),
                                        ariaLabel: 'Delete session'
                                    }]}
                                />
                            </DocumentCard>
                        )
                    })
                }
            </Stack>
        );
    }
}

export default SessionsPage;
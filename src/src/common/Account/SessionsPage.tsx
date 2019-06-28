import React from 'react';
import { INavBarOptions } from '../Navigation/INavBarOptions';
import Auth from '../Backend/Auth';
import Settings from '../Settings';
import CardPage from '../UIPages/CardPage';
import MessageBar from '../MessageBar';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

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
                        console.log(sessions)
                        self.setState({ sessions: sessions, isLoading: false });
                    }
                    else if (this.status === 404 || this.status === 0) {
                        MessageBar.setMessage("Cannot acess server!");
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
                        MessageBar.setMessage("Cannot acess server!");
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
            <CardPage isLoading={this.state.isLoading}>
                {
                    this.state.sessions.map((session, key) => {
                        return (
                            <div style={{ border: "2px solid black", padding: "10px", margin: "5px" }} key={key}>
                                Session:
                                <h5>{session.sessionId}</h5>
                                First login:
                                <p>{new Date(session.firstLogin).toLocaleString()}</p>
                                Last token request:
                                <p>{new Date(session.lastLogin).toLocaleString()}</p>
                                <PrimaryButton text="Delete Session" onClick={() => { this.deleteSession(session.sessionId) }} />
                            </div>
                        )
                    })
                }
            </CardPage>
        );
    }
}

export default SessionsPage;
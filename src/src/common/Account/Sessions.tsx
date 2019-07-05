import React from 'react';
import { INavBarOptions } from '../Navigation/INavBarOptions';
import Auth from '../Backend/Auth';
import Settings from '../Settings';
import MessageBar from '../MessageBar';
import { ErrorMessages } from '../ErrorMessages';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import './Sessions.css'
import Session, { ISession } from './Session';

interface IProps {
    setNavBarOptions?(newNavBarOptions: INavBarOptions): void
}

interface IState {
    sessions: Array<ISession>
}

class Sessions extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.state = {
            sessions: []
        }

        this.props.setNavBarOptions!(new INavBarOptions("Sessions", false));

        this.getSessions = this.getSessions.bind(this);

        this.getSessions();
    }

    async getSessions() {
        var self = this;

        var accessToken = await Auth.GetAccessToken();
        if (accessToken != null) {

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {

                if (this.readyState !== 4) return;

                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var sessions: Array<ISession> = JSON.parse(this.response);
                        self.setState({ sessions: sessions });
                    }
                    else if (this.status === 404 || this.status === 0) {
                        MessageBar.setMessage(ErrorMessages.CannotAccessServer);
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

    render() {
        return (
            <div>
                <Stack className="sessions" tokens={{ childrenGap: 20 }} horizontal disableShrink wrap horizontalAlign="center">
                    {
                        this.state.sessions.map((session, key) => {
                            return (
                                <Session key={key} session={session} updateSessions={this.getSessions} />
                            )
                        })
                    }
                </Stack>
            </div>
        );
    }
}

export default Sessions;
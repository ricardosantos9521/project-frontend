import React from 'react';
import { INavBarOptions } from '../Navigation/INavBarOptions';
import Settings from '../Settings';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import './Sessions.css'
import CardSession, { ISession } from './CardSession';
import { handleOkResponse, handleBadRequest, handleCannotAccessServer, handleUnauthorized, handleNotAcceptable } from '../Helpers/HandleResponsesXHR';
import { setAuthorizationHeader } from '../Helpers/Authorization';

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


        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                handleOkResponse(this, (r) => {
                    var sessions: Array<ISession> = JSON.parse(r.response);
                    self.setState({ sessions: sessions });
                })

                handleBadRequest(this);

                handleCannotAccessServer(this);

                handleUnauthorized(this);

                handleNotAcceptable(this);
            }
        });

        xhr.open("GET", Settings.serverUrl + "/api/session/sessions");
        await setAuthorizationHeader(xhr);
        
        xhr.send(null);
    }

    render() {
        return (
            <div>
                <Stack className="sessions" tokens={{ childrenGap: 20 }} horizontal disableShrink wrap horizontalAlign="center">
                    {
                        this.state.sessions.map((session, key) => {
                            return (
                                <CardSession key={key} session={session} />
                            )
                        })
                    }
                </Stack>
            </div>
        );
    }
}

export default Sessions;
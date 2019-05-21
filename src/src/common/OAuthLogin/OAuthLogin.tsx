import React from 'react';
import LoginGoogle from './OAuthGoogle';

interface IProps {
    OAuthLoginConclude(issuer: string, id_token: string): void
}

interface IState {
    error: string | null
}

class OAuthLogin extends React.Component<IProps, any> {

    state = {
        error: null
    }

    constructor(props: any) {
        super(props);

        this.OAuthLoginConclude = this.OAuthLoginConclude.bind(this);
        this.OAuthError = this.OAuthError.bind(this);
    }

    OAuthLoginConclude(issuer: string, id_token: string) {
        this.props.OAuthLoginConclude(issuer, id_token);
    }

    OAuthError(error: string) {
        this.setState({ error });
    }

    render() {
        return (
            <div>
                <LoginGoogle OAuthLoginConclude={this.OAuthLoginConclude} OAuthError={this.OAuthError} />
                {
                    (this.state.error != null) &&
                    (
                        <p>{this.state.error}</p>
                    )
                }
            </div>
        )
    }
}

export default OAuthLogin;
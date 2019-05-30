import React from 'react';
import { INavBarOptions } from '../../Navigation/INavBarOptions';
import OAuthLogin from '../OAuth/OAuthLogin';
import './SignInPage.css';
import AuthBackend from '../../Backend/Auth';
import CardPage from '../../UIPages/CardPage';

interface IProps {
    LoginConclude(): void,
    setNavBarOptions(newNavBarOptions: INavBarOptions): void,
}

interface IState {
    isLoading: boolean
}

class SignInPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            isLoading: false
        }

        this.props.setNavBarOptions(new INavBarOptions("Login"));

        this.OAuthLoginConclude = this.OAuthLoginConclude.bind(this);
    }

    async OAuthLoginConclude(issuer: string, id_token: string) {
        this.setState({ isLoading: true });
        await AuthBackend.GetToken(issuer, id_token);
        this.props.LoginConclude();
    }

    render() {
        return (
            <CardPage isLoading={this.state.isLoading} loadingMessage="Doing login with server">
                <div className="oauthcontent">
                    <h4>SignIn with your account: </h4>
                    <OAuthLogin OAuthLoginConclude={this.OAuthLoginConclude} />
                </div>
            </CardPage>
        )
    }
}

export default SignInPage;
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

class SignInPage extends React.Component<IProps, any> {

    constructor(props: any) {
        super(props);

        this.props.setNavBarOptions(new INavBarOptions("Login"));

        this.OAuthLoginConclude = this.OAuthLoginConclude.bind(this);
    }

    async OAuthLoginConclude(issuer: string, id_token: string) {
        await AuthBackend.GetToken(issuer, id_token);
        this.props.LoginConclude();
    }

    render() {
        return (
            <CardPage>
                <div className="oauthcontent">
                    <h4>SignIn with your account: </h4>
                    <OAuthLogin OAuthLoginConclude={this.OAuthLoginConclude} />
                </div>
            </CardPage>
        )
    }
}

export default SignInPage;
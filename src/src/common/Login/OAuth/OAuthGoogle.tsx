import React from "react";
import { GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogin } from 'react-google-login'
import { IOAuthLogin } from "./IOAuthLogin";

class OAuthGoogle extends IOAuthLogin {

    constructor(props: any) {
        super(props);

        this.signIn = this.signIn.bind(this);
    }

    signIn(response: GoogleLoginResponse | GoogleLoginResponseOffline) {

        let r: GoogleLoginResponse = response as GoogleLoginResponse;
        if (r !== undefined) {
            this.props.OAuthLoginConclude("google", r.getAuthResponse().id_token);
        }
        else {
            this.props.OAuthError("Error parsing id_token!");
        }
    }

    error(t: any) {
        this.props.OAuthError("Couldn't login with google!");
    }

    render() {
        return (
            <GoogleLogin
                clientId="213579612838-6lq11uuoinqh3e27qfrhi7a6hu434gog.apps.googleusercontent.com"
                buttonText="Google"
                onSuccess={this.signIn}
                onFailure={this.error}
                scope="profile"
            />
        );
    }
}

export default OAuthGoogle;

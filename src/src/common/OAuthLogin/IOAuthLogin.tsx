import React from "react";


interface IProps {
    OAuthLoginConclude: (issuer: string, id_token: string) => void,
    OAuthError: (error: string) => void
}

export class IOAuthLogin extends React.Component<IProps, any> {

}
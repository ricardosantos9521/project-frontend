import { Token, TokenResponse } from "./TokenResponse";
import { Semaphore } from "prex/out/lib/semaphore";
import Settings from "../Settings";
import Profile from "./Profile";
import MessageBar from "../MessageBar";

class Auth {

    private static accessToken: Token | null = null;

    private static sempahore = new Semaphore(1);

    public static async GetAcessToken(): Promise<Token | null> {
        await this.sempahore.wait();

        let accessToken: Token | null = null;

        if (this.accessToken === null) {
            let refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken != null) {
                var responseToken = await this.GetNewToken(refreshToken);
                this.accessToken = responseToken.accessToken;
                accessToken = this.accessToken;
            }
        }
        else {
            accessToken = this.accessToken;
        }

        this.sempahore.release();

        return accessToken;
    }

    public static async GetToken(issuer: string, id_token: string): Promise<any> {
        var self = this;

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {

                if (this.readyState !== 4) return;

                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var tokenResponse: TokenResponse = JSON.parse(this.responseText);
                        localStorage.setItem("refreshToken", tokenResponse.refreshToken.token);
                        resolve();
                    }
                    else if (this.status === 401) {
                        MessageBar.setMessage(this.responseText);
                        self.SignOut();
                    }
                }
            });

            xhr.open("POST", Settings.serverUrl + "/api/account/token");
            xhr.setRequestHeader("Content-Type", "application/json");

            var tokenRequest = JSON.stringify({ "Issuer": issuer, "IdToken": id_token });
            xhr.send(tokenRequest);
        })
    }

    private static GetNewToken(refreshToken: string): Promise<TokenResponse> {
        var self = this;

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState !== 4) return;

                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var tokenResponse: TokenResponse = JSON.parse(this.responseText);
                        localStorage.setItem("refreshToken", tokenResponse.refreshToken.token);
                        resolve(tokenResponse);
                    }
                    else if (this.status === 401) {
                        MessageBar.setMessage(this.responseText);
                        self.SignOut();
                    }
                }
            });

            xhr.open("POST", Settings.serverUrl + "/api/account/token/refresh");
            xhr.setRequestHeader("Content-Type", "application/json");

            var data = JSON.stringify({
                "token": refreshToken
            });

            xhr.send(data);
        });
    }

    public static async SignOut() {
        localStorage.removeItem("refreshToken");
        this.accessToken = null;
        Profile.DeleteLocalProfile();
    }
}

export default Auth;
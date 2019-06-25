import { Token, TokenResponse } from "./TokenResponse";
import { Semaphore } from "prex/out/lib/semaphore";
import Settings from "../Settings";
import Profile from "./Profile";
import MessageBar from "../MessageBar";

class Auth {

    private static accessToken: Token | null = null;

    private static sempahore = new Semaphore(1);

    public static async Login(issuer: string, id_token: string): Promise<Boolean> {
        var responseToken = await this.GetTokenWithIdToken(issuer, id_token);
        if (responseToken !== null) {
            this.accessToken = responseToken.accessToken;
            localStorage.setItem("refreshToken", responseToken.refreshToken.token);
            return true;
        }
        return false;
    }

    public static async GetAcessToken(): Promise<Token | null> {
        await this.sempahore.wait();

        let accessToken: Token | null = null;

        if (this.accessToken === null) {
            let refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken != null) {
                var responseToken = await this.GetTokenWithRefreshToken(refreshToken);
                if (responseToken !== null) {
                    this.accessToken = responseToken.accessToken;
                    localStorage.setItem("refreshToken", responseToken.refreshToken.token);
                    accessToken = this.accessToken;
                }
            }
        }
        else {
            accessToken = this.accessToken;
        }

        this.sempahore.release();

        return accessToken;
    }

    public static async GetTokenWithIdToken(issuer: string, id_token: string): Promise<TokenResponse | null> {
        var self = this;

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {

                if (this.readyState !== 4) return;

                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var tokenResponse: TokenResponse = JSON.parse(this.responseText);
                        resolve(tokenResponse);
                    }
                    else if (this.status === 401) {
                        MessageBar.setMessage(this.responseText);
                        self.SignOut();
                    }
                    else {
                        MessageBar.setMessage("Something happen try again later!");
                    }
                    resolve(null);
                }
            });

            xhr.open("POST", Settings.serverUrl + "/api/auth/token");
            xhr.setRequestHeader("Content-Type", "application/json");

            var tokenRequest = JSON.stringify({ "Issuer": issuer, "IdToken": id_token });
            xhr.send(tokenRequest);
        })
    }

    private static GetTokenWithRefreshToken(refreshToken: string): Promise<TokenResponse | null> {
        var self = this;

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState !== 4) return;

                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var tokenResponse: TokenResponse = JSON.parse(this.responseText);
                        resolve(tokenResponse);
                    }
                    else if (this.status === 401) {
                        MessageBar.setMessage(this.responseText);
                        self.SignOut();
                    }
                    else {
                        MessageBar.setMessage("Something happen try again later!");
                    }
                    resolve(null);
                }
            });

            xhr.open("POST", Settings.serverUrl + "/api/auth/token/refresh");
            xhr.setRequestHeader("Content-Type", "application/json");

            var data = JSON.stringify({
                "token": refreshToken
            });

            xhr.send(data);
        });
    }

    private static logout(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            var accessToken = await Auth.GetAcessToken();
            if (accessToken != null) {

                var xhr = new XMLHttpRequest();

                xhr.addEventListener("readystatechange", function () {

                    if (this.readyState !== 4) return;

                    if (this.readyState === 4) {
                        resolve();
                    }
                });

                xhr.open("POST", Settings.serverUrl + "/api/session/logout");
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken!.token);

                xhr.send(null);
            }
        });
    }

    public static async SignOut() {
        await this.logout();
        localStorage.removeItem("refreshToken");
        this.accessToken = null;
        Profile.DeleteLocalProfile();
    }
}

export default Auth;
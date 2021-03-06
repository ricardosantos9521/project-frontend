import { Token, TokenResponse } from "./TokenResponse";
import { Semaphore } from "prex/out/lib/semaphore";
import Settings from "../Settings";
import Profile from "./Profile";
import { handleOkResponse, handleBadRequest, handleNotAcceptable, handleUnauthorized, handleCannotAccessServer } from "../Helpers/HandleResponsesXHR";
import { setAuthorizationHeader } from "../Helpers/Authorization";

class Auth {

    private static accessToken: Token | null = null;

    private static semaphore = new Semaphore(1);

    public static async Login(issuer: string, id_token: string): Promise<[Boolean, Boolean]> {
        var responseToken = await this.GetTokenWithIdToken(issuer, id_token);
        if (responseToken !== null) {
            this.accessToken = responseToken.accessToken;
            sessionStorage.setItem("accessToken", JSON.stringify(responseToken.accessToken))
            localStorage.setItem("refreshToken", JSON.stringify(responseToken.refreshToken));
            return [true, responseToken.isAccountNew];
        }
        return [false, false];
    }

    public static async GetAccessToken(): Promise<Token | null> {
        await this.semaphore.wait();

        let accessToken: Token | null = null;

        if (this.accessToken === null) {
            let accessTokenSessionStorage = sessionStorage.getItem("accessToken");
            if (accessTokenSessionStorage !== null) {
                accessToken = JSON.parse(accessTokenSessionStorage) as Token;
            }
        }
        else {
            accessToken = this.accessToken;
        }

        if (accessToken === null || (accessToken !== null && new Date(accessToken!.expireUtc).getTime() < Date.now() + 60000)) {
            let refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken !== null) {
                var responseToken = await this.GetTokenWithRefreshToken((JSON.parse(refreshToken) as Token).token);
                if (responseToken !== null) {
                    accessToken = responseToken.accessToken;
                    sessionStorage.setItem("accessToken", JSON.stringify(responseToken.accessToken))
                    localStorage.setItem("refreshToken", JSON.stringify(responseToken.refreshToken));
                }
            }
        }

        this.accessToken = accessToken;

        this.semaphore.release();

        return accessToken;
    }

    public static async GetTokenWithIdToken(issuer: string, id_token: string): Promise<TokenResponse | null> {
        var self = this;

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {

                    handleOkResponse(this, (r) => {
                        var tokenResponse: TokenResponse = JSON.parse(r.responseText);
                        resolve(tokenResponse);
                    });

                    handleBadRequest(this);

                    handleNotAcceptable(this);

                    handleUnauthorized(this, async (r) => {
                        await self.SignOut();
                    });

                    handleCannotAccessServer(this);

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
                if (this.readyState === 4) {

                    handleOkResponse(this, (r) => {
                        var tokenResponse: TokenResponse = JSON.parse(r.responseText);
                        resolve(tokenResponse);
                    })

                    handleBadRequest(this);

                    handleUnauthorized(this, async (r) => {
                        await self.SignOut();
                    })

                    handleNotAcceptable(this);

                    handleCannotAccessServer(this);
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

    private static async logout(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    resolve();
                }
            });

            xhr.open("POST", Settings.serverUrl + "/api/session/logout");
            await setAuthorizationHeader(xhr);

            xhr.send(null);
        });
    }

    public static async SignOut() {
        await this.logout();
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        this.accessToken = null;
        Profile.DeleteLocalProfile();
    }
}

export default Auth;
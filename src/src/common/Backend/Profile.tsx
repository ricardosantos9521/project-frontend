import IProfile from "./IProfile";
import Settings from "../Settings";
import { handleOkResponse, handleBadRequest, handleCannotAccessServer, handleUnauthorized, handleNotAcceptable } from "../Helpers/HandleResponsesXHR";
import { setAuthorizationHeader } from "../Helpers/Authorization";

class Profile {
    private static profile: IProfile | null = JSON.parse(localStorage.getItem("profile")!);

    public static async Get(): Promise<IProfile> {
        var self = this;

        return new Promise(async function (resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    handleOkResponse(this, (r) => {
                        var profile: IProfile = JSON.parse(r.response);
                        localStorage.setItem("profile", JSON.stringify(profile));
                        self.profile = { ...profile };
                        dispatchEvent(new CustomEvent("profileChanged", { detail: self.profile }));
                        resolve(profile);
                    })

                    handleBadRequest(this);

                    handleCannotAccessServer(this);

                    handleUnauthorized(this);

                    handleNotAcceptable(this);
                }
            });

            xhr.open("GET", Settings.serverUrl + "/api/profile/");
            if (await setAuthorizationHeader(xhr)) {
                xhr.send(null);
            }
        });
    }

    public static Change(profile: IProfile, propertiesChanged: Array<String>): Promise<any> {

        return new Promise(async function (resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    handleOkResponse(this, (r) => {
                        resolve();
                    })

                    handleBadRequest(this);

                    handleCannotAccessServer(this);

                    handleUnauthorized(this);

                    handleNotAcceptable(this);
                }
            });

            xhr.open("POST", Settings.serverUrl + "/api/profile/");
            xhr.setRequestHeader("Content-Type", "application/json");
            await setAuthorizationHeader(xhr);

            xhr.send(JSON.stringify({
                "profile": profile,
                "propertiesChanged": propertiesChanged
            }));
        });
    }

    public static DeleteLocalProfile() {
        localStorage.removeItem("profile");
        this.profile = null;
        dispatchEvent(new CustomEvent("profileChanged", { detail: this.profile }));
    }

    public static SubscribeChanges(onProfileChanged: (event: CustomEvent<IProfile | null>) => void): IProfile | null {
        window.addEventListener("profileChanged", onProfileChanged as EventListener);

        return this.profile;
    }

    public static UnSubscribeChanges(onProfileChanged: (event: CustomEvent<IProfile | null>) => void) {
        window.removeEventListener("profileChanged", onProfileChanged as EventListener);
    }
}

export default Profile;
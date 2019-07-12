import Auth from "../Backend/Auth";

export async function setAuthorizationHeader(request: XMLHttpRequest) {
    var accessToken = await Auth.GetAccessToken();
    if (accessToken != null) {
        request.setRequestHeader("Authorization", "Bearer " + accessToken!.token);
    }
}
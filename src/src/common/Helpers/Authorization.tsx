import Auth from "../Backend/Auth";

export async function setAuthorizationHeader(request: XMLHttpRequest): Promise<Boolean> {
    var accessToken = await Auth.GetAccessToken();
    if (accessToken !== null) {
        request.setRequestHeader("Authorization", "Bearer " + accessToken!.token);
        return true;
    }
    return false;
}
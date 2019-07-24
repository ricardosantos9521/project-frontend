import { History, createBrowserHistory } from "history";

class Settings {

    public static isLocalhost = Boolean(
        window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]' ||
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
    );

    private static publicServerUrl: string = "https://ricspt.ddns.net/backendproject/";
    private static localhostServerUrl: string = "http://localhost:5000";

    public static serverUrl: string = (Settings.isLocalhost) ? Settings.localhostServerUrl : Settings.publicServerUrl;

    public static history: History<any> = createBrowserHistory({
        basename: '/reactproject'
    });
}

export default Settings;
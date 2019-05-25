import { History, createBrowserHistory } from "history";

class Settings {
    public static serverUrl: string = "https://rics.synology.me/backendproject/";

    public static history: History<any> = createBrowserHistory({
        basename: '/reactproject'
    });
}

export default Settings;
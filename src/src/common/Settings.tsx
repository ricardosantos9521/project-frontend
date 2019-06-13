import { History, createBrowserHistory } from "history";

class Settings {
    // public static serverUrl: string = "https://rics.synology.me/backendproject/";
    public static serverUrl: string = "http:/172.17.215.184:5000";

    public static history: History<any> = createBrowserHistory({
        basename: '/reactproject'
    });
}

export default Settings;
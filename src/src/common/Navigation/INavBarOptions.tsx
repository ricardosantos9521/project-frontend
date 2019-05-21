export class INavBarOptions {
    public backButton: boolean;
    public title: string;

    constructor(title: string, backButton: boolean = false) {
        this.title = title;
        this.backButton = backButton;
    }
}
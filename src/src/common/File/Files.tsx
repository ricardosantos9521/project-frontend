import React from 'react';
import Settings from '../Settings';
import Auth from '../Backend/Auth';
import IFileDescription from './IFileDescription';
import CardFile from './CardFile';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import './Files.css'
import MessageBar from '../MessageBar';
import { INavBarOptions } from '../Navigation/INavBarOptions';

interface IProps {
    setNavBarOptions?(newNavBarOptions: INavBarOptions): void
}

interface IState {
    files: Array<IFileDescription>
}

class Files extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.state = {
            files: []
        }

        this.props.setNavBarOptions!(new INavBarOptions("Files", false));

        this.getFiles = this.getFiles.bind(this);

        this.getFiles();
    }

    async getFiles() {
        this.setState({ files: [] });

        var self = this;

        var accessToken = await Auth.GetAccessToken();
        if (accessToken != null) {
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", async function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var files: Array<IFileDescription> = JSON.parse(this.responseText) as Array<IFileDescription>;
                        self.setState({ files });
                    }
                    else {
                        MessageBar.setMessage(this.responseText);
                    }
                }
            });

            xhr.open("GET", Settings.serverUrl + "/api/file/files");
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken!.token);

            xhr.send();
        }
    }

    render() {

        return (
            <div>
                <Stack className="files" tokens={{ childrenGap: 20 }} horizontal disableShrink wrap horizontalAlign="center">
                    {
                        this.state.files.map((file, key) => {
                            return (
                                <CardFile file={file} key={key} uniqueKey={key} />
                            )
                        })
                    }
                </Stack>
            </div >
        );
    }
}

export default Files;
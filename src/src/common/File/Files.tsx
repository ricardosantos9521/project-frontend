import React from 'react';
import Settings from '../Settings';
import Auth from '../Backend/Auth';
import IFileDescription from './IFileDescription';
import CardFile from './CardFile';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

interface IProps {
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

        this.getFiles();
    }

    async getFiles() {
        var self = this;

        var accessToken = await Auth.GetAccessToken();
        if (accessToken != null) {
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", async function () {
                if (this.readyState === 4) {
                    var files: Array<IFileDescription> = JSON.parse(this.responseText) as Array<IFileDescription>;
                    self.setState({ files });
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
                <Stack tokens={{ childrenGap: 20 }}>
                    {
                        this.state.files.map((file, key) => {
                            return (
                                <CardFile file={file} key={key} />
                            )
                        })
                    }
                </Stack>
            </div >
        );
    }
}

export default Files;
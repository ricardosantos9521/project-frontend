import React from 'react';
import Settings from '../Settings';
import Auth from '../Backend/Auth';
import IFileDescription from './IFileDescription';
import CardFile from './CardFile';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

interface IProps {
}

interface IState {
    uploadButtonEnabled: Boolean,
    fileInfo: IFileDescription | null
}

class UploadFile extends React.Component<IProps, IState>{

    file: File | null = null;

    constructor(props: IProps) {
        super(props);

        this.state = {
            uploadButtonEnabled: false,
            fileInfo: null
        }

        this.fileSelected = this.fileSelected.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    fileSelected(event: React.ChangeEvent<HTMLInputElement>) {
        var file = event.target.files![0];
        if (file !== undefined) {
            this.file = file;
            this.setState({ uploadButtonEnabled: true });
        }
    }

    async uploadFile() {
        if (this.file !== null) {
            var self = this;
            var accessToken = await Auth.GetAcessToken();
            if (accessToken != null) {
                var data = new FormData();
                data.append("file", this.file);

                var xhr = new XMLHttpRequest();

                xhr.addEventListener("readystatechange", async function () {
                    if (this.readyState === 4) {
                        var fileInfo = JSON.parse(this.responseText);
                        self.setState({ fileInfo });
                    }
                });

                xhr.open("POST", Settings.serverUrl + "/api/file/upload");
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken!.token);

                xhr.send(data);
            }
        }
    }

    render() {

        return (
            <div>
                <input type="file" name="file" onChange={this.fileSelected} />
                <DefaultButton text="upload" onClick={this.uploadFile} disabled={!this.state.uploadButtonEnabled} />
                {
                    (this.state.fileInfo !== null) && (
                        <CardFile file={this.state.fileInfo} />
                    )
                }
            </div >
        );
    }
}

export default UploadFile;
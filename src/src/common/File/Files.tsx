import React from 'react';
import Settings from '../Settings';
import IFileDescription from './IFileDescription';
import CardFile from './CardFile';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import './Files.css'
import { handleOkResponse, handleBadRequest, handleCannotAccessServer, handleUnauthorized, handleNotAcceptable } from '../Helpers/HandleResponsesXHR';
import { INavBarOptions } from '../Navigation/INavBarOptions';
import { setAuthorizationHeader } from '../Helpers/Authorization';
import { Label } from 'office-ui-fabric-react/lib/Label';
import SpinnerComponent from '../UIPages/SpinnerComponent';

interface IProps {
    setNavBarOptions?(newNavBarOptions: INavBarOptions): void
}

interface IState {
    files: Array<IFileDescription>,
    isLoading: Boolean
}

class Files extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.state = {
            files: [],
            isLoading: true
        }

        this.props.setNavBarOptions!(new INavBarOptions("Files"));

        this.getFiles = this.getFiles.bind(this);
    }

    async componentDidMount() {
        await this.getFiles();
    }

    async getFiles() {
        this.setState({ files: [] });

        var self = this;

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", async function () {
            if (this.readyState === 4) {
                handleOkResponse(this, (r) => {
                    var files: Array<IFileDescription> = JSON.parse(r.responseText) as Array<IFileDescription>;
                    self.setState({ files, isLoading: false });
                })

                handleBadRequest(this);

                handleCannotAccessServer(this);

                handleUnauthorized(this);

                handleNotAcceptable(this);
            }
        });

        xhr.open("GET", Settings.serverUrl + "/api/file/files");
        await setAuthorizationHeader(xhr);

        xhr.send();
    }

    render() {
        if (this.state.isLoading!)
            return (<SpinnerComponent isLoading={this.state.isLoading!} loadingMessage="Getting list of files from server!" />)

        return (
            <div>
                <Stack className="files" tokens={{ childrenGap: 20 }} horizontal disableShrink wrap horizontalAlign="center">
                    {
                        (this.state.files.length !== 0) ?
                            this.state.files.map((file, key) => {
                                return (
                                    <CardFile file={file} key={key} uniqueKey={key} />
                                )
                            }) :
                            (
                                <Label>No files</Label>
                            )
                    }
                </Stack>
            </div >
        );
    }
}

export default Files;
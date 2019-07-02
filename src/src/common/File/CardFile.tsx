import React from 'react';
import IFileDescription from './IFileDescription';
import { DocumentCard, DocumentCardType, DocumentCardDetails, DocumentCardTitle, DocumentCardActivity, IDocumentCardPreviewProps, DocumentCardPreview } from 'office-ui-fabric-react/lib/DocumentCard';
import { getTheme } from 'office-ui-fabric-react/lib/Styling';
import Auth from '../Backend/Auth';
import Settings from '../Settings';
import IProfile from '../Account/IProfile';

interface IProps {
    file: IFileDescription,
    profile: IProfile
}

interface IState {
}

class CardFile extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.getFile = this.getFile.bind(this);
    }

    promptToDownload(blob: Blob, fileName: string) {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.dispatchEvent(new MouseEvent('click'));
    }

    async getFile(id: string) {
        var self = this;

        var accessToken = await Auth.GetAcessToken();
        if (accessToken != null) {
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var fileInfo: IFileDescription = JSON.parse(this.response);
                        var xhr2 = new XMLHttpRequest();

                        xhr2.addEventListener("readystatechange", function () {
                            if (this.readyState === 4) {
                                if (this.status === 200) {
                                    var blob: Blob = this.response as Blob;
                                    self.promptToDownload(blob, fileInfo.fileName);
                                }
                            }
                        });
                        xhr2.open("GET", Settings.serverUrl + "/api/file/get/" + id);
                        xhr2.responseType = "blob";
                        xhr2.setRequestHeader("Authorization", "Bearer " + accessToken!.token);

                        xhr2.send();
                    }
                }
            });
            xhr.open("GET", Settings.serverUrl + "/api/file/info/" + id);
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken!.token);

            xhr.send();
        }
    }

    render() {
        const theme = getTheme();
        const previewPropsUsingIcon: IDocumentCardPreviewProps = {
            previewImages: [
                {
                    previewIconProps: { iconName: 'OpenFile', styles: { root: { fontSize: 42, color: theme.palette.white } } },
                    width: 144
                }
            ],
            styles: { previewIcon: { backgroundColor: theme.palette.themePrimary } }
        };

        return (
            <DocumentCard type={DocumentCardType.compact} onClick={async () => { await this.getFile(this.props.file!.fileId) }}>
                <DocumentCardPreview {...previewPropsUsingIcon} />
                <DocumentCardDetails>
                    <DocumentCardTitle title={this.props.file.fileName} />
                    <DocumentCardTitle title={this.props.file.contentType} showAsSecondaryTitle={true} />
                    <DocumentCardActivity
                        activity={new Date(this.props.file.creationDate).toLocaleString()}
                        people={
                            [
                                {
                                    name: this.props.profile.firstName + ' ' + this.props.profile.lastName,
                                    profileImageSrc: '',
                                    initials: this.props.profile.firstName.charAt(0)
                                }
                            ]
                        }
                    />
                </DocumentCardDetails>
            </DocumentCard>
        );
    }
}

export default CardFile;
import React from 'react';
import IFileDescription from './IFileDescription';
import { DocumentCard, DocumentCardType, DocumentCardDetails, DocumentCardTitle, DocumentCardActivity, IDocumentCardPreviewProps, DocumentCardPreview, DocumentCardActions } from 'office-ui-fabric-react/lib/DocumentCard';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { getTheme } from 'office-ui-fabric-react/lib/Styling';
import Auth from '../Backend/Auth';
import Settings from '../Settings';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

interface IProps {
    file: IFileDescription
}

interface IState {
    showShareDialog: boolean,
    userIdToShare: string,
    giveReadPermission: boolean,
    giveWritePermission: boolean,
    givePublicPermission: boolean
}

class CardFile extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.state = {
            showShareDialog: false,
            userIdToShare: "",
            giveReadPermission: false,
            giveWritePermission: false,
            givePublicPermission: false
        }

        this.getFile = this.getFile.bind(this);
        this.openShareDialog = this.openShareDialog.bind(this);
        this.closeShareDialog = this.closeShareDialog.bind(this);
        this.onChangeUserId = this.onChangeUserId.bind(this);
        this.onChangeReadPermission = this.onChangeReadPermission.bind(this);
        this.onChangeWritePermission = this.onChangeWritePermission.bind(this);
        this.onChangePublicPermission = this.onChangePublicPermission.bind(this);
        this.shareFile = this.shareFile.bind(this);
    }

    promptToDownload(blob: Blob, fileName: string) {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.dispatchEvent(new MouseEvent('click'));
    }

    private async getFile(id: string) {
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

    private openShareDialog() {
        this.setState({ showShareDialog: true });
    }

    private closeShareDialog() {
        this.setState({ showShareDialog: false });
    }

    private onChangeUserId(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        this.setState({ userIdToShare: newValue! });
    }

    private onChangeReadPermission(event: React.MouseEvent<HTMLElement>, checked?: boolean) {
        this.setState({ giveReadPermission: checked! })
    }

    private onChangeWritePermission(event: React.MouseEvent<HTMLElement>, checked?: boolean) {
        this.setState({ giveWritePermission: checked! })
    }

    private onChangePublicPermission(event: React.MouseEvent<HTMLElement>, checked?: boolean) {
        this.setState({ givePublicPermission: checked! })
    }

    private async shareFile() {
        var accessToken = await Auth.GetAcessToken();
        if (accessToken != null) {
            var self = this;

            var data = {
                fileId: this.props.file!.fileId,
                personUniqueId: this.state.userIdToShare,
                readPermission: this.state.giveReadPermission,
                writePermission: this.state.giveWritePermission,
                publicPermission: this.state.givePublicPermission
            };

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    self.closeShareDialog();
                    console.log(this.responseText);
                }
            });

            xhr.open("POST", "http://localhost:5000/api/file/share");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken!.token);

            xhr.send(JSON.stringify(data));
        }

    }

    render() {
        console.log(this.props.file);

        const theme = getTheme();
        const previewPropsUsingIcon: IDocumentCardPreviewProps = {
            previewImages: [
                {
                    previewIconProps: { iconName: 'TextDocument', styles: { root: { fontSize: 42, color: theme.palette.white } } },
                    width: 144
                }
            ],
            styles: { previewIcon: { backgroundColor: theme.palette.themePrimary } },
        };

        const properties: IButtonProps[] = [
            {
                iconProps: { iconName: 'Share' },
                onClick: this.openShareDialog,
                ariaLabel: 'share action'
            },
            {
                iconProps: { iconName: 'Download' },
                onClick: async () => { await this.getFile(this.props.file!.fileId) },
                ariaLabel: 'download action'
            }
        ]

        if (this.props.file.writePermission) {
            properties.push({
                iconProps: { iconName: 'FieldChanged' },
                ariaLabel: 'Write adn read'
            })
        }
        else if (this.props.file.readPermission) {
            properties.push({
                iconProps: { iconName: 'FieldReadOnly' },
                ariaLabel: 'Read only'
            })
        }

        if (this.props.file.isPublic) {
            properties.push({
                iconProps: { iconName: 'Contact' },
                ariaLabel: 'Public'
            })
        }


        const _labelId: string = getId('dialogLabel');
        const _subTextId: string = getId('subTextLabel');

        return (
            <div>
                <DocumentCard type={DocumentCardType.compact}>
                    <DocumentCardPreview {...previewPropsUsingIcon} />
                    <DocumentCardDetails>
                        <DocumentCardTitle title={this.props.file.fileName} />
                        <DocumentCardTitle title={this.props.file.contentType} showAsSecondaryTitle={true} />
                        <DocumentCardActivity
                            activity={new Date(this.props.file.creationDate).toLocaleString()}
                            people={
                                [
                                    {
                                        name: this.props.file.createdBy.firstName + ' ' + this.props.file.createdBy.lastName,
                                        profileImageSrc: '',
                                        initials: this.props.file.createdBy.firstName.charAt(0)
                                    }
                                ]
                            }
                        />
                    </DocumentCardDetails>
                    <DocumentCardActions
                        actions={properties}
                    />
                </DocumentCard>
                <Dialog
                    hidden={!this.state.showShareDialog}
                    onDismiss={this.closeShareDialog}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Share ' + this.props.file!.fileName,
                        subText: ''
                    }}
                    modalProps={{
                        titleAriaId: _labelId,
                        subtitleAriaId: _subTextId,
                        isBlocking: false,
                        styles: { main: { maxWidth: 450 } },
                        dragOptions: undefined
                    }}
                >
                    <TextField
                        label="UserId"
                        value={this.state.userIdToShare}
                        onChange={this.onChangeUserId}
                        required
                    />
                    <Toggle
                        label="Give Read Permissions"
                        offText="No"
                        onText="Yes"
                        checked={this.state.giveReadPermission}
                        onChange={this.onChangeReadPermission}
                    />
                    <Toggle
                        label="Give Write Permissions"
                        offText="No"
                        onText="Yes"
                        checked={this.state.giveWritePermission}
                        onChange={this.onChangeWritePermission}
                    />
                    <Toggle
                        label="Make it public"
                        offText="No"
                        onText="Yes"
                        checked={this.state.givePublicPermission}
                        onChange={this.onChangePublicPermission}
                    />
                    <DialogFooter>
                        <PrimaryButton text="Share" onClick={async () => { await this.shareFile() }} />
                    </DialogFooter>
                </Dialog>
            </div >
        );
    }
}

export default CardFile;
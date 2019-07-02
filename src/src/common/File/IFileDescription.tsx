export default interface IFileDescription {
    fileId: string,
    contentType: string,
    fileName: string,
    fileLength: number,
    isPublic: boolean
    readPermission: boolean,
    writePermission: boolean,
    creationDate: string,
    createdBy: ICreatedByProfile
}

interface ICreatedByProfile {
    firstName: string,
    lastName: string,
    uniqueId: string
}
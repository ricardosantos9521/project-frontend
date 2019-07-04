export default interface IProfile {
    uniqueId: string;
    firstName: string;
    lastName: string;
    email: string;
    picture: string | undefined;
    birthDate: Date | undefined;
    gender: string | undefined;
    isAdmin: boolean
}
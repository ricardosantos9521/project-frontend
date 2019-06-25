export default interface IProfile {
    firstName: string;
    lastName: string;
    email: string;
    picture: string | undefined;
    birthDate: number | undefined;
    gender: string | undefined;
    isAdmin: boolean
}
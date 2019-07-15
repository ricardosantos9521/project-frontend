export interface TokenResponse {
    accessToken: Token,
    refreshToken: Token,
    isAccountNew: Boolean
}

export interface Token {
    token: string,
    expireUtc: string
}
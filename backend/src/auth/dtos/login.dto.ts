export interface LoginDto {
    email: string;
    password: string;
}

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}
export interface JwtDto {
    email: string;
    sub: string;
    role: Role;
}
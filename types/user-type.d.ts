import { Role } from "./role.type";

export interface User {
    id: number;
    email: string;
    password: string;
    roles: Role[];
    resetToken?: string;
    resetTokenExpiration?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    }
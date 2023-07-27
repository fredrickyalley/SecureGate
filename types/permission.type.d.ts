import { Role } from "./role.type";

export interface Permission {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    roles: Role[];
    }
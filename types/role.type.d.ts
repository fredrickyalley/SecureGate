// interface/role.interface.ts
    
import { Permission } from "./permission.type";

export interface Role {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    permissions: Permission[];
    }
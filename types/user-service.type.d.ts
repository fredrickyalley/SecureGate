import {User} from './user-type'

export interface CreateUserDto {
    email: string;
    password: string;
    }
    
    // interface/update-user.dto.ts
    
    export interface UpdateUserDto {
    email?: string;
    password?: string;
    }
    
    
    export class SecureUserService {
    getUsers(): Promise<User[]>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    getUserById(id: number): Promise<User>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(id: number): Promise<User>;
    deactivateUser(id: number): Promise<void>;
    reactivateUser(id: number): Promise<void>;
    }
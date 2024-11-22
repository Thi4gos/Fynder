import { User } from "./user"
export interface registryUser extends Pick<User, 'firstName' | 'lastName' | 'email' | 'pass' | 'tel' | 'birthDate'> {
    
}
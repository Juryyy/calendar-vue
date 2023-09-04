export interface googleEvent {
    id: number;
    title: string;
    description: string;
    start: Date;
    end: Date;
    calEventId: string;
    userId: number;
    user: User;
}


export interface User {
    id: number;
    email: string;
    firstName: string;
    password: string;
    lastName: string;
    role: Role;
    googleEvents: googleEvent[];
    events: inputEvent[];
}
  
export interface inputEvent {
    id: number;
    title: string;
    description: string;
    start: Date;
    end: Date;
    userId: number;
    uploaded: boolean;
    user: User;
}
  
export enum Role {
    USER,
    ADMIN,
    EMPLOYEE
}

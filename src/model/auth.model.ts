export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'user' | 'craftsman' | 'admin';
}

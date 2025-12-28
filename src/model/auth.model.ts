export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
  data: {
        accessToken: string;
        accessTokenExpiresAt: string;
        refreshToken: string;
        role: 'user' | 'craftsman' | 'admin';
        fullName: string;
    };
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'user' | 'craftsman' | 'admin';
}

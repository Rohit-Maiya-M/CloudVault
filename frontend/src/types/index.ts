export interface User {
    id: number;
    username: string;
    email: string;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    tokenType: string;
    user: User;
}

export interface FileMetadata {
    id: number;
    fileName: string;
    s3Key: string;
    fileSize: number;
    contentType: string;
    etag: string | null;
    uploadedAt: string;
    updatedAt: string;
    storageProvider: string;
    owner: User;
}
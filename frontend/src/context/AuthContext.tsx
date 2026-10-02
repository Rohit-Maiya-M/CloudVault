import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import api from "../services/api";
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    User,
} from "../types";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (request: LoginRequest) => Promise<void>;
    register: (request: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = sessionStorage.getItem("cloudvault_token");
        const storedUser = sessionStorage.getItem("cloudvault_user");

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch {
                sessionStorage.removeItem("cloudvault_token");
                sessionStorage.removeItem("cloudvault_user");
            }
        }

        setIsLoading(false);
    }, []);

    const login = async (request: LoginRequest) => {
        const response = await api.post<AuthResponse>(
            "/api/auth/login",
            request
        );

        const authData = response.data;

        sessionStorage.setItem("cloudvault_token", authData.token);
        sessionStorage.setItem(
            "cloudvault_user",
            JSON.stringify(authData.user)
        );

        setToken(authData.token);
        setUser(authData.user);
    };

    const register = async (request: RegisterRequest) => {
        await api.post("/api/auth/register", request);

        await login({
            email: request.email,
            password: request.password,
        });
    };

    const logout = () => {
        sessionStorage.removeItem("cloudvault_token");
        sessionStorage.removeItem("cloudvault_user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
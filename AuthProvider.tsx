import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const [user, setUser] = useState<User | null>(null);

    const login = (token: string, user?: User) => {
        localStorage.setItem("token", token);
        setToken(token);
        if (user) setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

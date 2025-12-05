import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';
import { api } from '../utils/api';

interface JWTPayload {
    username: string;
    roles: string[];
    exp: number;
    iat: number;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (role: string) => boolean;
    canEdit: (resource?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const decodeAndSetUser = (token: string) => {
        try {
            const decoded = jwtDecode<JWTPayload>(token);
            const user: User = {
                id: '0', // Placeholder
                username: decoded.username,
                roles: decoded.roles || [] // Fallback to empty array
            };
            setUser(user);
            return user;
        } catch (error) {
            console.error('Invalid token', error);
            logout();
            return null;
        }
    };

    useEffect(() => {
        // Check local storage for persisted session
        const token = localStorage.getItem('it-reco-token');
        if (token) {
            decodeAndSetUser(token);
        }
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post<{ token: string }>('/login_check', { username, password });
            if (response.token) {
                localStorage.setItem('it-reco-token', response.token);
                decodeAndSetUser(response.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('it-reco-token');
        localStorage.removeItem('it-reco-user'); // Clean up old key if exists
    };

    const hasRole = (role: string): boolean => {
        if (!user) return false;
        return user.roles.includes(role);
    };

    const canEdit = (resource?: string): boolean => {
        if (!user) return false;
        if (hasRole('ROLE_ADMIN')) return true;

        // ROLE_USER can only edit Sales (Ventes)
        if (resource === 'sales') return true;

        return false;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole, canEdit }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


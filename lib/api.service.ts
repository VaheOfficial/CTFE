import type { GlobalState } from "../types/global.types";
import type { User } from "../types/user.type";
import { mcToken } from "../utils/constants";
import Cookies from 'js-cookie';
export class ApiService {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    }

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get(mcToken)}`,
        };
    }

    private async request(url: string, options: RequestInit = {}) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        });

        return response;
    }

    async login(email: string, password: string) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            return {
                success: false,
                message: errorData.error || 'Login failed',
            }
        }

        return response.json();
    }

    async me() {
        const response = await this.request('/auth/me', {
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        return response.json();
    }

    async logout() {
        const response = await this.request('/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Logout failed');
        }

        return response.json();
    }    

    async changePassword(oldPassword: string, newPassword: string) {
        const response = await this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword }),
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Password change failed',
            }
        }
        return response.json();
    }

    async logoutAll() {
        const response = await this.request('/auth/logout-all', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        return response.json();
    }

    async getAllUsers() {
        const response = await this.request('/users/all', {
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to get all users',
            }
        }
        return response.json();
    }

    async updateUser(id: string,user: Partial<User>) {
        const response = await this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to update user',
            }
        }
        return response.json();
    }

    async getGlobalState() {
        const response = await this.request('/global/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to get global state',
            }
        }
        return response.json();
    }

    async createGlobalState(globalState: GlobalState) {
        const response = await this.request('/global/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
            body: JSON.stringify(globalState),
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to create global state',
            }
        }
        return response.json();
    }

    async updateUserAsAdmin(id: string, user: Partial<User>) {
        const response = await this.request(`/users/admin/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to update user',
            }
        }
        return response.json();
    }

    async resetUserPassword(id: string, password: string) {
        const response = await this.request(`/users/admin/reset-password/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
            body: JSON.stringify({
                newPassword: password,
            }),
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to reset user password',
            }
        }
        return response.json();
    }
}

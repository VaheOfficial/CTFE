import { store } from '../redux/store';

export class ApiService {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    }

    private getHeaders() {
        const authToken = store.getState().auth.token;
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
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
            return {
                success: false,
                message: errorData.data.message || 'Login failed',
            }
        }

        return response.json();
    }

    async me() {
        const response = await this.request('/auth/me');
        return response.json();
    }

    async logout() {
        const response = await this.request('/auth/logout', {
            method: 'POST',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Logout failed');
        }

        return response.json();
    }    
}

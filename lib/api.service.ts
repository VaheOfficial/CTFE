import type { GlobalState } from "../types/global.types";
import type { User } from "../types/user.type";
import { mcToken } from "../utils/constants";
import Cookies from 'js-cookie';
export class ApiService {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://192.168.1.51:5000';
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

    async getWeatherData() {
        const response = await this.request('/weather/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to get weather data',
            }
        }
        return response.json();
    }

    async setTemperaturePreference(preference: string) {
        const response = await this.request('/weather/temperature-preference', {
            method: 'POST',
            body: JSON.stringify({ preference }),
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to set temperature preference',
            }
        }
        return response.json();
    }

    async getLaunches() {
        const response = await this.request('/global/launch', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to get launches',
            }
        }
        return response.json();
    }

    async getRadioChannels() {
        const response = await this.request('/audio/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to get radio channels',
            }
        }
        return response.json();
    }

    async playRadioChannel() {
        const response = await this.request('/audio/play', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            }
        });
        
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to play radio channel',
            }
        }

        // Check if this is a streaming response (audio content)
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('audio/')) {
            // This is the actual audio stream, return the URL directly
            return {
                success: true,
                data: {
                    url: `${this.baseUrl}/audio/play`,
                    name: 'Mission Control',
                    frequency: '121.5'
                }
            };
        }

        // Otherwise, it's metadata about the stream
        try {
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch {
            // If JSON parsing fails, assume it's a stream and return URL
            return {
                success: true,
                data: {
                    url: `${this.baseUrl}/audio/play`,
                    name: 'Mission Control',
                    frequency: '121.5'
                }
            };
        }
    }

    async getAudioStreamUrl() {
        // Direct method to get stream URL without triggering server-side logic
        // This is better for streaming audio as it doesn't wait for any response
        return {
            success: true,
            data: {
                url: `${this.baseUrl}/audio/stream`,
                name: 'Mission Control',
                frequency: '121.5'
            }
        };
    }

    async getVideoSources() {
        const response = await this.request('/video/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to get video sources',
            }
        }
        return response.json();
    }

    async getVideoPreviews() {
        const response = await this.request('/video/previews/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.data.message || 'Failed to get video previews',
            }
        }
        return response.json();
    }

    async streamVideo(name: string) {
        // Return the stream URL - let the video element handle the actual streaming
        const streamUrl = `${this.baseUrl}/video/stream/${name}`;
        
        return {
            success: true,
            data: {
                url: streamUrl
            }
        };
    }

    // System diagnostic tool - for network testing
    async runSystemDiagnostic(command: string, target: string) {
        const response = await this.request('/admin/diagnostic', {
            method: 'POST',
            body: JSON.stringify({ command, target }),
            headers: {
                'Authorization': `Bearer ${Cookies.get(mcToken)}`,
            },
        });
        
        if(!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.error || 'Failed to run system diagnostic',
                data: null
            }
        }
        return response.json();
    }
}
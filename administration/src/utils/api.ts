const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://127.0.0.1:8000/api';

interface ApiOptions extends RequestInit {
    params?: Record<string, string>;
}

class ApiClient {
    private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        const { params, ...init } = options;

        let url = `${API_BASE_URL}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        const token = localStorage.getItem('it-reco-token');
        const headers = {
            'Accept': 'application/ld+json',
            'Content-Type': 'application/ld+json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...init.headers,
        };

        const response = await fetch(url, {
            ...init,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error['hydra:description'] || response.statusText);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    public get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', params });
    }

    public post<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    public put<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    public patch<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/merge-patch+json',
            },
            body: JSON.stringify(data),
        });
    }

    public delete(endpoint: string): Promise<void> {
        return this.request<void>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient();

/**
 * CoffeeSpot API - API Client Helper
 */

const API = {
    BASE_URL: 'http://localhost:3000',
    TOKEN_KEY: 'coffeespot_token',
    USER_KEY: 'coffeespot_user',

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    },

    removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    },

    getUser() {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    setUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },

    getHeaders(includeAuth = true) {
        const headers = { 'Content-Type': 'application/json' };
        if (includeAuth && this.getToken()) {
            headers['Authorization'] = `Bearer ${this.getToken()}`;
        }
        return headers;
    },

    async request(endpoint, options = {}) {
        const url = `${this.BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: { ...this.getHeaders(options.includeAuth !== false), ...options.headers },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401) {
                    this.removeToken();
                    if (!window.location.pathname.includes('/auth/')) {
                        window.location.href = '/auth/login.html';
                    }
                }
                throw { status: response.status, message: data.message || 'An error occurred' };
            }
            return data;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 0, message: 'Network error. Please check your connection.' };
        }
    },

    get(endpoint, opts = {}) { return this.request(endpoint, { ...opts, method: 'GET' }); },
    post(endpoint, body, opts = {}) { return this.request(endpoint, { ...opts, method: 'POST', body: JSON.stringify(body) }); },
    put(endpoint, body, opts = {}) { return this.request(endpoint, { ...opts, method: 'PUT', body: JSON.stringify(body) }); },
    patch(endpoint, body, opts = {}) { return this.request(endpoint, { ...opts, method: 'PATCH', body: JSON.stringify(body) }); },
    delete(endpoint, opts = {}) { return this.request(endpoint, { ...opts, method: 'DELETE' }); },
};

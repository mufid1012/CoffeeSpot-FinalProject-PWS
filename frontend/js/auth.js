/**
 * CoffeeSpot API - Auth Utilities
 */

const Auth = {
    async login(email, password) {
        const data = await API.post('/auth/login', { email, password }, { includeAuth: false });
        if (data.token) {
            API.setToken(data.token);
            API.setUser(data.user);
        }
        return data;
    },

    async register(username, email, password) {
        return API.post('/auth/register', { username, email, password }, { includeAuth: false });
    },

    logout() {
        API.removeToken();
        window.location.href = '/auth/login.html';
    },

    async getProfile() {
        return API.get('/auth/profile');
    },

    requireAuth() {
        if (!API.isAuthenticated()) {
            window.location.href = '/auth/login.html';
            return false;
        }
        return true;
    },

    requireAdmin() {
        if (!API.isAuthenticated()) {
            window.location.href = '/auth/login.html';
            return false;
        }
        if (!API.isAdmin()) {
            window.location.href = '/user/dashboard.html';
            return false;
        }
        return true;
    },

    redirectIfAuthenticated(destination = '/user/dashboard.html') {
        if (API.isAuthenticated()) {
            const user = API.getUser();
            if (user && user.role === 'admin') {
                window.location.href = '/admin/dashboard.html';
            } else {
                window.location.href = destination;
            }
            return true;
        }
        return false;
    }
};

// UI Helpers
const UI = {
    showLoading(button) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner"></span> Loading...';
    },

    hideLoading(button) {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || 'Submit';
    },

    showAlert(container, type, message) {
        const icons = {
            success: '✓',
            danger: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        container.innerHTML = `
            <div class="alert alert-${type}">
                <span class="alert-icon">${icons[type] || 'ℹ'}</span>
                <div class="alert-content">
                    <p class="alert-message">${message}</p>
                </div>
            </div>
        `;
    },

    hideAlert(container) {
        container.innerHTML = '';
    },

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!');
        });
    },

    showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--color-bg-card);
            color: var(--color-text-primary);
            padding: 12px 24px;
            border-radius: var(--radius-md);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar?.classList.toggle('open');
    },

    initSidebarToggle() {
        const toggle = document.querySelector('.sidebar-toggle');
        toggle?.addEventListener('click', this.toggleSidebar);
    }
};

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

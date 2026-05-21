declare global {
    interface Window {
        _env: {
            backendUrl: string;
        };
    }
}

export const environment = {
    backendUrl: window._env?.backendUrl || 'http://localhost:8080/api'
};

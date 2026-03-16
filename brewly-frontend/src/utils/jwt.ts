// Utility to decode JWT and extract payload (no validation, just decode)
export function decodeJwt(token: string): any {
    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (e) {
        return null;
    }
}

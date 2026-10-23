import { CsrfError, NetworkError, errorForResponse } from './errors.js';

const CSRF_TOKEN_URL = '/api/v1/customers/csrf-token';

export async function isCsrfFailure(response) {
    if (response.status !== 403) {
        return false;
    }

    try {
        const payload = await response.clone().json();

        return payload?.error?.code === 'csrf_token_invalid';
    } catch {
        return false;
    }
}

export async function fetchCsrfToken(options) {
    let response;

    try {
        response = await fetch(CSRF_TOKEN_URL, {
            credentials: options.credentials ?? 'same-origin',
            signal: options.signal,
        });
    } catch (cause) {
        throw new NetworkError(cause);
    }

    if (!response.ok) {
        const csrf = await isCsrfFailure(response);
        throw errorForResponse(response, csrf);
    }

    let payload;
    try {
        payload = await response.json();
    } catch (cause) {
        throw new CsrfError('The CSRF token response was invalid.', response, { cause });
    }

    if (typeof payload?.token !== 'string' || payload.token.length === 0) {
        throw new CsrfError('The CSRF token response was invalid.', response);
    }

    return payload.token;
}

const CSRF_TOKEN_URL = '/api/v1/customers/csrf-token';
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export class HttpError extends Error {
    constructor(message, response) {
        super(message);
        this.name = 'HttpError';
        this.response = response;
        this.status = response.status;
    }
}

export class UnauthorizedError extends HttpError {
    constructor(response) {
        super('The request is unauthorized.', response);
        this.name = 'UnauthorizedError';
    }
}

export class CsrfError extends HttpError {
    constructor(message, response, options = {}) {
        super(message, response);
        this.name = 'CsrfError';
        this.cause = options.cause;
    }
}

export class NetworkError extends Error {
    constructor(cause) {
        super('The request could not be completed because of a network error.');
        this.name = 'NetworkError';
        this.cause = cause;
    }
}

function isMutating(method) {
    return MUTATING_METHODS.has(method.toUpperCase());
}

function errorForResponse(response, csrf = false) {
    if (response.status === 401) {
        return new UnauthorizedError(response);
    }

    if (csrf) {
        return new CsrfError('A valid CSRF token is required.', response);
    }

    return new HttpError(`The request failed with status ${response.status}.`, response);
}

async function isCsrfFailure(response) {
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

async function fetchCsrfToken(options) {
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

export async function request(input, options = {}) {
    const method = (options.method ?? 'GET').toString().toUpperCase();
    const requestOptions = {
        ...options,
        method,
        credentials: options.credentials ?? 'same-origin',
    };

    if (isMutating(method)) {
        const token = await fetchCsrfToken(options);
        const headers = new Headers(options.headers);
        headers.set('X-CSRF-Token', token);
        requestOptions.headers = headers;
    }

    let response;
    try {
        response = await fetch(input, requestOptions);
    } catch (cause) {
        throw new NetworkError(cause);
    }

    if (!response.ok) {
        const csrf = isMutating(method) && await isCsrfFailure(response);
        throw errorForResponse(response, csrf);
    }

    return response;
}

export function get(input, options = {}) {
    return request(input, { ...options, method: 'GET' });
}

export function post(input, options = {}) {
    return request(input, { ...options, method: 'POST' });
}

export function put(input, options = {}) {
    return request(input, { ...options, method: 'PUT' });
}

export function patch(input, options = {}) {
    return request(input, { ...options, method: 'PATCH' });
}

export function del(input, options = {}) {
    return request(input, { ...options, method: 'DELETE' });
}

const client = { request, get, post, put, patch, delete: del };

export default client;

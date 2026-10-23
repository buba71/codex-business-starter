import { fetchCsrfToken, isCsrfFailure } from './csrf.js';
import { errorForResponse, NetworkError } from './errors.js';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export {
    CsrfError,
    HttpError,
    NetworkError,
    UnauthorizedError,
} from './errors.js';

function isMutating(method) {
    return MUTATING_METHODS.has(method.toUpperCase());
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

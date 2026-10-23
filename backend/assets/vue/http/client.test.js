import { afterEach, describe, expect, it, vi } from 'vitest';
import client, {
    CsrfError,
    HttpError,
    NetworkError,
    UnauthorizedError,
    get,
    post,
    request,
} from './client.js';

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

const response = (status, body = {}) => {
    let consumed = false;
    const result = {
        ok: status >= 200 && status < 300,
        status,
        json: vi.fn().mockImplementation(async () => {
            if (consumed) {
                throw new TypeError('Body already consumed');
            }

            consumed = true;
            return body;
        }),
    };

    result.clone = () => response(status, body);

    return result;
};

describe('http client', () => {
    it('uses same-origin credentials by default and preserves GET options', async () => {
        const fetchMock = vi.fn().mockResolvedValue(response(200));
        vi.stubGlobal('fetch', fetchMock);

        await get('/api/customers', {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
        });

        expect(fetchMock).toHaveBeenCalledWith('/api/customers', {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
            credentials: 'same-origin',
            method: 'GET',
        });
    });

    it.each(['POST', 'PUT', 'PATCH', 'DELETE'])('gets a CSRF token before %s and injects it', async (method) => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(response(200));
        vi.stubGlobal('fetch', fetchMock);

        await request('/api/customers/42', {
            method,
            headers: { Accept: 'application/json' },
            body: JSON.stringify({ name: 'Ada' }),
            redirect: 'error',
        });

        expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/v1/customers/csrf-token', {
            credentials: 'same-origin',
            signal: undefined,
        });
        const mutationOptions = fetchMock.mock.calls[1][1];
        expect(mutationOptions).toMatchObject({
            method,
            body: JSON.stringify({ name: 'Ada' }),
            redirect: 'error',
            credentials: 'same-origin',
        });
        expect(mutationOptions.headers.get('Accept')).toBe('application/json');
        expect(mutationOptions.headers.get('X-CSRF-Token')).toBe('csrf-token');
    });

    it('preserves an explicit credentials option for both token and mutation requests', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(response(201));
        vi.stubGlobal('fetch', fetchMock);

        await post('/api/customers', { credentials: 'include' });

        expect(fetchMock.mock.calls[0][1].credentials).toBe('include');
        expect(fetchMock.mock.calls[1][1].credentials).toBe('include');
    });

    it.each([
        ['a missing token', {}],
        ['a null token', { token: null }],
        ['a non-string token', { token: 123 }],
        ['an empty token', { token: '' }],
    ])('rejects a mutation when the CSRF payload contains %s', async (_description, payload) => {
        const fetchMock = vi.fn().mockResolvedValueOnce(response(200, payload));
        vi.stubGlobal('fetch', fetchMock);

        await expect(post('/mutating')).rejects.toBeInstanceOf(CsrfError);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('rejects a mutation when the CSRF payload is malformed JSON', async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce({
            ...response(200),
            json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
        });
        vi.stubGlobal('fetch', fetchMock);

        await expect(post('/mutating')).rejects.toBeInstanceOf(CsrfError);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('classifies a CSRF bootstrap access_denied response as an HTTP error', async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(response(403, {
            error: { code: 'access_denied' },
        }));
        vi.stubGlobal('fetch', fetchMock);

        await expect(post('/mutating')).rejects.toMatchObject({
            name: 'HttpError',
            status: 403,
        });
    });

    it('classifies an unauthorized CSRF bootstrap response as UnauthorizedError', async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(response(401));
        vi.stubGlobal('fetch', fetchMock);

        await expect(post('/mutating')).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it('classifies a failed CSRF bootstrap response as an HTTP error', async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(response(500));
        vi.stubGlobal('fetch', fetchMock);

        await expect(post('/mutating')).rejects.toMatchObject({
            name: 'HttpError',
            status: 500,
        });
    });

    it('classifies a mutating csrf_token_invalid response as a CSRF error', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(response(403, {
                error: { code: 'csrf_token_invalid' },
            }));
        vi.stubGlobal('fetch', fetchMock);

        await expect(post('/mutating')).rejects.toBeInstanceOf(CsrfError);
    });

    it('keeps an HTTP error response body readable after CSRF classification', async () => {
        const errorResponse = response(403, {
            error: { code: 'access_denied' },
        });
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(errorResponse);
        vi.stubGlobal('fetch', fetchMock);

        const error = await post('/mutating').catch((caughtError) => caughtError);

        expect(error).toBeInstanceOf(HttpError);
        await expect(error.response.json()).resolves.toEqual({
            error: { code: 'access_denied' },
        });
    });

    it('preserves unauthorized responses as UnauthorizedError', async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(response(401));
        vi.stubGlobal('fetch', fetchMock);

        await expect(get('/private')).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it.each([
        ['an access_denied response', response(403, { error: { code: 'access_denied' } })],
        ['a missing error payload', response(403)],
        ['a malformed error payload', {
            ...response(403),
            json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
        }],
    ])('preserves %s as an HTTP error for a mutating request', async (_description, errorResponse) => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(errorResponse)
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(response(422));
        vi.stubGlobal('fetch', fetchMock);

        await expect(post('/mutating')).rejects.toMatchObject({
            name: 'HttpError',
            status: 403,
        });
        await expect(post('/invalid')).rejects.toBeInstanceOf(HttpError);
    });

    it('throws typed errors for other HTTP and network failures', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(response(422))
            .mockRejectedValueOnce(new Error('offline'));
        vi.stubGlobal('fetch', fetchMock);

        await expect(post('/invalid')).rejects.toBeInstanceOf(HttpError);
        await expect(get('/offline')).rejects.toBeInstanceOf(NetworkError);
    });

    it('does not replay a failed mutation', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response(200, { token: 'csrf-token' }))
            .mockResolvedValueOnce(response(500));
        vi.stubGlobal('fetch', fetchMock);

        await expect(post('/mutating')).rejects.toMatchObject({ status: 500 });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('exports the convenience client without replay behavior', () => {
        expect(client).toMatchObject({ request, get, post });
        expect(typeof client.delete).toBe('function');
    });
});

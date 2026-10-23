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

export function errorForResponse(response, csrf = false) {
    if (response.status === 401) {
        return new UnauthorizedError(response);
    }

    if (csrf) {
        return new CsrfError('A valid CSRF token is required.', response);
    }

    return new HttpError(`The request failed with status ${response.status}.`, response);
}

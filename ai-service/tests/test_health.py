from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from main import HealthResponse, app


EXPECTED_RESPONSE = {
    "status": "ok",
    "service": "ai-engine",
    "version": "1.0.0",
}


@pytest.fixture()
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client


def test_health_returns_http_200(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200


def test_health_returns_exact_json(client: TestClient) -> None:
    response = client.get("/health")

    assert response.json() == EXPECTED_RESPONSE


def test_health_response_matches_pydantic_contract(client: TestClient) -> None:
    response = client.get("/health")

    validated = HealthResponse.model_validate(response.json())

    assert validated.model_dump() == EXPECTED_RESPONSE


@pytest.mark.parametrize(
    "payload",
    [
        {"service": "ai-engine", "version": "1.0.0"},
        {"status": "ready", "service": "ai-engine", "version": "1.0.0"},
        {"status": "ok", "service": "other", "version": "1.0.0"},
        {"status": "ok", "service": "ai-engine", "version": "2.0.0"},
        {**EXPECTED_RESPONSE, "extra": "field"},
    ],
)
def test_health_response_rejects_invalid_schema_inputs(payload: dict[str, str]) -> None:
    with pytest.raises(ValidationError):
        HealthResponse.model_validate(payload)

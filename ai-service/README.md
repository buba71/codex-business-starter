# AI Engine

Optional, independent FastAPI service for training exercises. It is not integrated with the Symfony application.

## Requirements

Python 3.12.

## Install

From `ai-service/`:

```bash
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
```

## Run

```bash
.venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

The health endpoint is available at `http://127.0.0.1:8001/health`. FastAPI's default OpenAPI documentation is available at `/docs`.

## Test

```bash
.venv/bin/python -m pip check
.venv/bin/python -m pytest -q
```

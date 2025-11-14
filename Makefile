backend-dev:
	@ cd backend && PYTHONPATH=. uv run uvicorn src.main:app --reload

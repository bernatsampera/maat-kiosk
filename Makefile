.PHONY: setup setup-backend setup-backend-deps setup-frontend setup-frontend-deps dev dev-backend dev-frontend clean

# Setup everything
setup: setup-backend setup-frontend

# Setup backend
setup-backend:
	@ echo "Setting up backend..."
	@ cd backend && python -m venv .venv 2>/dev/null || true
	@ cd backend && .venv/bin/pip install --upgrade pip
	@ cd backend && .venv/bin/pip install -e .
	@ echo "Backend setup complete"

# Setup backend with uv (recommended)
setup-backend-deps:
	@ echo "Installing backend dependencies with uv..."
	@ cd backend && uv sync
	@ echo "Backend dependencies installed"

# Setup frontend
setup-frontend:
	@ echo "Setting up frontend..."
	@ cd frontend && npm install
	@ echo "Frontend setup complete"

# Setup frontend dependencies only
setup-frontend-deps:
	@ echo "Installing frontend dependencies..."
	@ cd frontend && npm install
	@ echo "Frontend dependencies installed"

# Start development servers (both backend and frontend)
dev: dev-backend dev-frontend

# Start backend development server
dev-backend:
	@ cd backend && PYTHONPATH=. uv run uvicorn src.main:app --reload

# Start frontend development server
dev-frontend:
	@ cd frontend && npx expo start --port 8082

# Start iOS simulator
ios:
	@ cd frontend && npx expo start --ios

# Start Android emulator
android:
	@ cd frontend && npx expo start --android

# Clean setup
clean:
	@ echo "Cleaning..."
	@ cd backend && rm -rf .venv __pycache__ .pytest_cache || true
	@ cd frontend && rm -rf node_modules || true
	@ echo "Clean complete"

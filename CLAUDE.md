# Sculpt - Fitness Tracking Application

## Project Overview

Sculpt is a full-stack fitness tracking web application that allows users to log and monitor their workouts and nutrition intake. The application features user authentication, workout logging with exercises, and nutrition tracking capabilities.

## Architecture

### Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy 2.0 (ORM with async support)
- PostgreSQL (Database)
- Alembic (Database migrations)
- FastAPI Users (Authentication and user management)
- JWT authentication (Bearer tokens)
- asyncpg (Async PostgreSQL driver)

**Frontend:**
- React 19.2.4 with TypeScript
- Material-UI (MUI) v7
- React Router DOM v7
- Axios (HTTP client)
- React Scripts (Create React App)

**Infrastructure:**
- Docker Compose for orchestration
- Hot-reload enabled for both frontend and backend
- PostgreSQL 13 database container

## Project Structure

```
sculpt/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   │   ├── user.py      # User model with FastAPI Users
│   │   │   ├── workout.py   # Workout and Exercise models
│   │   │   └── nutrition.py # Nutrition model
│   │   ├── routers/         # API route handlers
│   │   │   ├── workouts.py  # Workout endpoints
│   │   │   └── nutrition.py # Nutrition endpoints
│   │   ├── schemas/         # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── workout.py
│   │   │   └── nutrition.py
│   │   ├── auth.py          # FastAPI Users authentication setup
│   │   ├── crud.py          # Database CRUD operations
│   │   ├── database.py      # Database connection and session management
│   │   └── main.py          # FastAPI application entry point
│   ├── alembic/             # Database migrations
│   ├── wait_for_db.py       # Database readiness check script
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/           # React page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── WorkoutLogPage.tsx
│   │   │   └── NutritionLogPage.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Authentication context provider
│   │   ├── services/
│   │   │   └── api.ts       # API service functions
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── routes.tsx       # Route configuration
│   │   ├── App.tsx          # Root application component
│   │   └── index.tsx        # Application entry point
│   └── package.json         # Frontend dependencies
├── docker-compose.yml       # Docker orchestration configuration
├── docker-compose.env       # Environment variables
└── README.md               # Setup and usage instructions
```

## Database Schema

### Users Table
- `id` (Integer, Primary Key)
- Standard FastAPI Users fields (email, hashed_password, is_active, is_verified, etc.)
- Relationships: workouts, nutrition_entries

### Workouts Table
- `id` (Integer, Primary Key)
- `name` (String, required)
- `user_id` (Foreign Key → users.id)
- Relationship: exercises (one-to-many)

### Exercises Table
- `id` (Integer, Primary Key)
- `name` (String, required)
- `sets` (Integer, required)
- `reps` (Integer, required)
- `weight` (Integer, required)
- `workout_id` (Foreign Key → workouts.id)

### Nutrition Table
- `id` (Integer, Primary Key)
- `date` (Date, default: today)
- `calories` (Integer, required)
- `protein` (Integer, required)
- `user_id` (Foreign Key → users.id)

## API Endpoints

### Authentication (FastAPI Users)
- `POST /api/auth/register` - User registration
- `POST /api/auth/jwt/login` - Login (returns JWT token)
- `POST /api/auth/jwt/logout` - Logout
- `POST /api/auth/request-verify-token` - Request email verification
- `POST /api/auth/verify` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update current user profile

### Workouts (Protected Routes)
- `POST /api/workouts/` - Create new workout with exercises
- `GET /api/workouts/` - List user's workouts (with pagination)

### Nutrition (Protected Routes)
- `POST /api/nutrition/` - Create nutrition entry
- `GET /api/nutrition/` - List user's nutrition entries (with pagination)

## Key Features

### Authentication System
- JWT-based authentication using FastAPI Users
- Bearer token authentication
- Token stored in localStorage
- Axios interceptor for automatic token injection
- Protected routes requiring authentication

### Workout Management
- Create workouts with multiple exercises
- Each exercise tracks: name, sets, reps, weight
- User-specific workout data
- Eager loading of exercises with workouts (avoiding N+1 queries)

### Nutrition Tracking
- Log daily nutrition entries
- Track calories and protein intake
- Date-based entries
- User-specific nutrition data

### Frontend Features
- React Context API for authentication state management
- Protected routes using React Router
- Material-UI components for consistent design
- TypeScript for type safety
- Axios service layer for API communication

## Development Setup

### Running with Docker Compose

1. Start all services:
```bash
docker-compose up -d --build
```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

3. Stop services:
```bash
docker-compose down --volumes --remove-orphans
```

### Docker Services Configuration

**Database (PostgreSQL)**
- Port: 5432
- Persistent volume: postgres_data

**Backend**
- Port: 8000
- Hot-reload enabled (uvicorn --reload)
- Auto-runs migrations on startup (alembic upgrade head)
- Waits for database readiness before starting

**Frontend**
- Port: 3000
- Hot-reload enabled (CHOKIDAR_USEPOLLING)
- Proxies API requests to backend
- Development build with source maps

## Environment Variables

Required environment variables (in `docker-compose.env`):
- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name
- `DATABASE_URL` - PostgreSQL connection string (async format)
- `SECRET_KEY` - JWT secret key for token signing

## Code Quality Tools

The backend uses:
- `pre-commit` - Git hooks for code quality
- `black` - Code formatting
- `ruff` - Fast Python linter

## Recent Commits

- **2d4ae1a**: Configure frontend dev server with proxy and hot reload
- **02f1fff**: Add Claude sub agents
- **d47c7cf**: Fix create workout endpoint
- **7991e7a**: Add pre-commit hooks
- **6c3ab4d**: Add frontend

## API Design Patterns

### Async Database Operations
All database operations use SQLAlchemy's async API with AsyncSession for better performance and scalability.

### Dependency Injection
FastAPI's dependency injection is used extensively for:
- Database session management (`get_async_db`)
- User authentication (`current_active_user`)
- Automatic request validation

### Eager Loading
Uses `selectinload` to prevent N+1 query problems when fetching workouts with their exercises.

### Request/Response Models
Pydantic schemas separate:
- Create schemas (input validation)
- Read schemas (response serialization)
- Update schemas (partial updates)

## Frontend Patterns

### Context Pattern
AuthContext provides global authentication state and functions (login, logout, register) to all components.

### Protected Routes
Routes check authentication status and redirect to login if not authenticated.

### API Service Layer
Centralized API communication in `services/api.ts` with:
- Type-safe request/response handling
- Automatic JWT token injection
- Consistent error handling

## TypeScript Types

All API models have corresponding TypeScript interfaces:
- `User`, `UserLogin`, `UserRegister`
- `Workout`, `Exercise`
- `Nutrition`
- `AuthResponse`

## Testing Strategy

Frontend testing setup includes:
- Jest test runner
- React Testing Library
- User event testing utilities

## Security Features

1. Password hashing (via FastAPI Users)
2. JWT token authentication with configurable lifetime (3600 seconds)
3. Protected API routes requiring valid authentication
4. CORS configuration (implicit in FastAPI setup)
5. Environment-based secret management

## Common Development Tasks

### Adding a New Model
1. Create model in `backend/app/models/`
2. Create schemas in `backend/app/schemas/`
3. Add CRUD operations in `backend/app/crud.py`
4. Create router in `backend/app/routers/`
5. Include router in `backend/app/main.py`
6. Create Alembic migration: `alembic revision --autogenerate -m "description"`
7. Add TypeScript types in `frontend/src/types.ts`
8. Create API service functions in `frontend/src/services/api.ts`

### Running Database Migrations
```bash
# Inside backend container
docker-compose exec backend alembic revision --autogenerate -m "migration message"
docker-compose exec backend alembic upgrade head
```

### Viewing Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Browser Support

Production builds support:
- >0.2% market share browsers
- Excludes dead browsers
- Excludes Opera Mini

Development builds support latest versions of:
- Chrome
- Firefox
- Safari

## Known Limitations

1. No workout deletion/update endpoints yet
2. No nutrition entry deletion/update endpoints yet
3. Email verification requires SMTP configuration (not set up)
4. No pagination UI in frontend (though API supports it)
5. No data visualization/charts for workout progress
6. No exercise library or templates
7. No social features or sharing capabilities

## Future Enhancement Opportunities

1. Add update/delete operations for workouts and nutrition
2. Implement workout templates and exercise library
3. Add data visualization (charts, progress tracking)
4. Implement workout history and statistics
5. Add meal planning features
6. Create mobile-responsive design improvements
7. Add profile customization (goals, preferences)
8. Implement workout sharing and social features
9. Add export functionality (CSV, PDF reports)
10. Integrate with fitness trackers/wearables
11. Add exercise instructions and form videos
12. Implement progressive overload tracking
13. Add REST API rate limiting
14. Implement comprehensive error logging
15. Add integration and E2E tests

## Notes for AI Assistants

- When modifying database models, always create an Alembic migration
- All API endpoints except auth routes require authentication
- Use async/await pattern for all database operations
- Frontend uses React 19 with concurrent features
- Material-UI components use the latest v7 API
- JWT tokens expire after 1 hour (3600 seconds)
- Database relationships use SQLAlchemy 2.0 mapped_column syntax
- TypeScript strict mode is not explicitly enabled
- The proxy configuration routes `/api` requests from frontend to backend

from fastapi import FastAPI
from .auth import auth_backend, fastapi_users
from .routers import workouts, nutrition
from .schemas import UserRead, UserCreate, UserUpdate

app = FastAPI()

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/api/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/api/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/api/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/api/users",
    tags=["users"],
)

app.include_router(workouts.router, prefix="/api")
app.include_router(nutrition.router, prefix="/api")

@app.get("/api")
def read_root():
    return {"message": "Welcome to the Sculpt API"}

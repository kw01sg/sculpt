# Scuplt

I have created a `docker-compose.yml` file to make it easy to run the entire "Sculpt" application. This setup includes the PostgreSQL database, the Python backend, and the React frontend.

Here is how you can run the application:

## Prerequisites

- Make sure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and running on your system.

## 1. Start the Application

Open your terminal in the root directory of the `sculpt` project and run the following command:

```bash
docker-compose up -d --build
```

The `-d` flag runs the containers in detached mode (in the background).

This command will:

1. Build the Docker images for the backend and frontend services.
2. Start the containers for the database, backend, and frontend in the correct order.
3. The backend will automatically apply any pending database migrations.

## 2. Access the Application

Once the containers are running, you can access the different parts of the application:

- **Frontend (Sculpt App):** Open your web browser and navigate to [http://localhost:3000](http://localhost:3000)
- **Backend API:** The API is accessible at `http://localhost:8000`. You can access the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

## 3. Restart Services (After Code Changes)

After making code changes, you can restart individual services to pick up the changes:

```bash
# Restart a specific service (e.g., backend)
docker-compose restart backend

# Restart the frontend
docker-compose restart frontend

# Restart all services
docker-compose restart
```

**Note:** The backend is configured with hot-reload (`--reload` flag), so it will automatically detect changes without needing a restart. For the frontend, a restart will pick up your source code changes.

If you need to rebuild after dependency changes (e.g., new packages in `package.json` or `requirements.txt`):

```bash
# Rebuild and restart a specific service
docker-compose up -d --build backend

# Rebuild and restart all services
docker-compose up -d --build
```

## 4. Stop the Application

To stop all the running containers and remove them automatically, run:

```bash
docker-compose down --volumes --remove-orphans
```

- `--volumes`: Removes the named volumes declared in the `volumes` section of the `docker-compose.yml` (in this case, `postgres_data`). Use this if you want to completely reset your database data. If you want to preserve your database data, you can omit this flag.
- `--remove-orphans`: Removes containers for services that are not defined in the Compose file.

This will stop and remove the containers. If `--volumes` is included, your database data will also be removed.

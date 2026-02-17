import socket
import time
import os

host = os.environ.get("POSTGRES_HOST", "db")
port = int(os.environ.get("POSTGRES_PORT", 5432))

def wait_for_db():
    while True:
        try:
            with socket.create_connection((host, port), timeout=1):
                print("Database is ready!")
                break
        except OSError:
            print("Database isn't ready yet, waiting...")
            time.sleep(1)

if __name__ == "__main__":
    wait_for_db()

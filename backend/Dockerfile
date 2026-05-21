FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

# Use Gunicorn with Uvicorn workers for production-grade serving
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "4", "app.main:app", "-b", "0.0.0.0:8000"]
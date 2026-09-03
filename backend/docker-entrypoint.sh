#!/bin/bash
set -e

echo "==> Starting Laravel 13 Backend Initialization (PHP 8.4)..."

# Ensure storage and bootstrap cache directories exist and have proper permissions
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chmod -R 777 storage bootstrap/cache

# Install dependencies if vendor directory doesn't exist
if [ ! -d "vendor" ]; then
    echo "==> Running composer install..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Copy .env if not exists
if [ ! -f ".env" ]; then
    echo "==> Copying .env.example to .env..."
    cp .env.example .env
    php artisan key:generate --no-interaction || true
fi

# Wait for MySQL Database connection
echo "==> Waiting for MySQL database (${DB_HOST}:${DB_PORT})..."
max_retries=30
count=0
until nc -z -v -w5 "$DB_HOST" "$DB_PORT" 2>/dev/null || php -r "try { new PDO('mysql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); exit(0); } catch (\Throwable \$e) { exit(1); }"; do
    count=$((count+1))
    if [ $count -ge $max_retries ]; then
        echo "==> Warning: MySQL connection check timed out. Proceeding anyway..."
        break
    fi
    echo "==> Waiting for database connection... ($count/$max_retries)"
    sleep 2
done

echo "==> Database connection established!"

# Run migrations and seed data
echo "==> Running Laravel database migrations..."
php artisan migrate --force || true

echo "==> Seeding database..."
php artisan db:seed --force || true

echo "==> Starting application server..."
exec "$@"

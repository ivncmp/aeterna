#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "This will destroy all database data. Press Ctrl+C to cancel."
sleep 3

docker compose down -v
docker compose up --build

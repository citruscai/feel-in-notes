#!/bin/bash

# Start the Flask backend
flask run --host=0.0.0.0 --port=5000 &

# Start the Next.js frontend
pnpm run dev

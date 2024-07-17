
FROM python:3.11-slim-bullseye AS base

# Install dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg software-properties-common && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install pnpm
RUN npm install -g pnpm

# Build stage for frontend
FROM base AS build
WORKDIR /workspace

# Copy and install frontend dependencies
COPY package.json package-lock.json ./
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Production stage for final image
FROM base AS final
WORKDIR /workspace

# Copy only the necessary files from the build stage
COPY --from=build /workspace /workspace

# Install backend dependencies
RUN pip install --no-cache-dir -r api/requirements.txt

ENV FLASK_APP=api/run.py
ENV FLASK_ENV=development

EXPOSE 3000
EXPOSE 5000

CMD ["./start.sh"]

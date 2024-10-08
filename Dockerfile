FROM python:3.11-slim-bullseye AS base

RUN apt-get update && \
    apt-get install -y curl gnupg software-properties-common && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

RUN npm install -g pnpm

FROM base AS build
WORKDIR /workspace

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

FROM base AS final
WORKDIR /workspace

COPY --from=build /workspace /workspace

RUN pip install --no-cache-dir -r api/requirements.txt

ENV FLASK_APP=api/run.py
ENV FLASK_ENV=development

EXPOSE 3000
EXPOSE 5000

CMD ["pnpm", "run", "dev"]

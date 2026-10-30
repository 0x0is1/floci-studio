FROM oven/bun:1.2-alpine

WORKDIR /app

RUN apk add --no-cache docker-cli

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install

COPY tsconfig.json ./
COPY src/ ./src/

EXPOSE 4501

CMD ["bun", "--watch", "src/index.ts"]

FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts --registry https://registry.npmmirror.com && \
    npm rebuild esbuild better-sqlite3
COPY . .
RUN npm run build:node

FROM node:20-alpine

RUN apk add --no-cache python3 make g++ tzdata

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts --registry https://registry.npmmirror.com && \
    npm rebuild better-sqlite3 && \
    apk del python3 make g++
COPY --from=builder /app/dist ./dist

# Use /data as the canonical data directory to match common docker-compose mappings
RUN mkdir -p /data && chown -R node:node /data /app
VOLUME /data

ENV PORT=5678
ENV DATA_DIR=/data
ENV TZ=Asia/Shanghai
EXPOSE 5678

# Run as unprivileged node user for better security
USER node

CMD ["node", "dist/server.js"]

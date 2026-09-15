# Production Multi-Stage Dockerfile for Parth's Autonomous Business Agent
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source files
COPY . .

# Build Vite client and bundle Express server into dist/server.cjs
RUN npm run build

# --- Production Runner ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package definition and install production dependencies only
COPY package.json ./
RUN npm install --omit=dev

# Copy built distribution assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html

# Expose port 3000
EXPOSE 3000

# Start compiled server
CMD ["node", "dist/server.cjs"]

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy packages
COPY packages/shared/package.json ./packages/shared/

# Copy Web
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

# Build with public API URL (must be set at build time for Next.js)
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app/apps/web
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy standalone build (monorepo structure)
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Set environment
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Run from the web app directory
WORKDIR /app/apps/web
CMD ["node", "server.js"]

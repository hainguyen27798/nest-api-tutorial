## Development stage
FROM node:22.15.0-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock (if available)
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code
COPY --chown=node:node . .

# build
RUN npm run build

RUN npm ci --only=production && npm cache clean --force

USER node

# Production Stage
FROM node:22.15.0-alpine

RUN apk add --no-cache tini

# Set the working directory inside the container
WORKDIR /app

ENV NODE_ENV=prod

RUN apk add openssl dos2unix

# Copy bundle build
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/.env.prod ./
COPY --chown=node:node --from=builder /app/generate-rsa.sh ./
COPY --chown=node:node --from=builder /app/dist ./dist

RUN mkdir -p logs && chown node:node logs && chmod 755 logs
RUN mkdir -p secrets && chown node:node secrets && chmod 755 secrets

RUN chmod +x generate-rsa.sh
RUN chown -R node:node /app
RUN dos2unix generate-rsa.sh

RUN sh generate-rsa.sh

# Set user to node
USER node

CMD ["node", "dist/main.js"]

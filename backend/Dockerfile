# Use an official Node.js runtime
FROM node:20.18.0-alpine

# Set the working directory
WORKDIR /backend

# Set environment variables
ENV NODE_ENV=production

# Install dependencies first for better caching
COPY package*.json ./

# Install production dependencies and clean up
RUN apk add --no-cache --virtual .gyp python3 make g++ && \
    npm install --only=production && \
    apk del .gyp

# Create non-root user and switch
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy application code
COPY . .

# Expose port (adjust as needed)
EXPOSE 9000

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl --fail http://localhost:9000/health || exit 1

# Start the server
CMD ["node", "server.js"]
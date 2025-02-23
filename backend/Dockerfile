# Use an official Node.js runtime
FROM node:20-alpine  

# Set the working directory inside the container
WORKDIR /backend

# Set environment variable inside the container
ENV NODE_ENV=production  

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production  

# Copy the rest of the backend files
COPY . .  

# Expose backend port (modify if needed)
EXPOSE 9000

# Start the backend server
CMD ["node", "server.js"]

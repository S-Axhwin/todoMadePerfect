# Build stage
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install && npm install ts-node

# Copy the rest of the application code
COPY . .
# Expose the port the app runs on (if needed, adjust accordingly)
EXPOSE 8080 5555
RUN chown -R node /usr/app
USER node

# Command to start the application
CMD [a"node", "dist/index.js"]

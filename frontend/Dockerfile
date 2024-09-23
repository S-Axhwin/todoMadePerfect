# Build stage
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN ["npm", "i", "pnpm"] && ["pnpm", "install"]



# Copy the rest of the application code
COPY . .
# Expose the port the app runs on (if needed, adjust accordingly)
EXPOSE 5173

# Command to start the application
CMD ["pnpm", "run", "dev"]

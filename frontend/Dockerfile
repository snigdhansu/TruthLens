# Use an official Node.js runtime as a base image
FROM node:20.11.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json, install dependencies, and clean npm cache in one step
COPY package*.json ./
RUN npm cache clean --force && npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

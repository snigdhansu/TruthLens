# Use an official Node.js runtime as a base image
FROM node:20.11.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && npm install

# Copy the rest of the application code
COPY . .

# Set the environment variable to allow legacy OpenSSL algorithms
ENV NODE_OPTIONS=--openssl-legacy-provider

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

FROM node:20

# Create and use /app as the working directory
WORKDIR /app

# Copy package files from the project root (one level up from Dockerfile)
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Optional: install vite globally
RUN npm install -g vite@latest

# Copy all source code from project root into container
COPY .. .

# Vite default port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev"]

# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only dependency manifests first (leverages Docker cache)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of your frontend code
COPY . .

# Build the frontend
RUN pnpm run build

# Serve the frontend with a simple web server
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]

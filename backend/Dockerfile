FROM node:18-slim

# ✅ Install Puppeteer system dependencies for Chromium
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libgbm1 \
  libxshmfence1 \
  libu2f-udev \
  libvulkan1 \
  libdrm2 \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source files
COPY . .

# Build the project
RUN npm run build

# Expose backend port
EXPOSE 5001

# Start the server (you can change this to "dev" for dev container)
CMD ["node", "dist/index.js"]

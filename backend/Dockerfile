FROM node:18-alpine
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm install
# Install nodemon globally
RUN npm install -g nodemon
# Copy application code
COPY . .
# Expose port
EXPOSE 5000
# Start application
CMD ["nodemon", "index.js"]
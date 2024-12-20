# Use Node.js image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source files
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]


# React Dockerfile
FROM node:14

# Create and set working directory
WORKDIR /Front_end_react

# Install dependencies
COPY package.json package.json /Front_end_react/
RUN npm install

# Copy the current directory contents into the container
COPY . /Front_end_react/

# Start the app
CMD ["npm", "start"]

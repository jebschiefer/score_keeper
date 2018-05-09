FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install dependecies. A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

RUN npm run build

EXPOSE 8080

# Set default run command
CMD [ "npm", "run", "start:prod" ]

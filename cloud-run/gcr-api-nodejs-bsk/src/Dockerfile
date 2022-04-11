FROM node:12

# Creates app directory
WORKDIR /usr/src/app

# Installs app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json package*.json ./

# Building code for production
RUN npm install --only=production

# Bundles app source
COPY . .

# Commands to run at startup
CMD ["npm", "start"]
# Use an official Python runtime as a parent image
FROM node:carbon

# Create app directory
WORKDIR /usr/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Make port 9000 available to the world outside this container
EXPOSE 9000

# Define environment variable
#ENV NAME World

# Run app when the container launches
CMD [ "npm", "start" ]
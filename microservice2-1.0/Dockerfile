FROM node:10.17.0-alpine3.10
#Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8081
CMD [ "npm", "start" ]

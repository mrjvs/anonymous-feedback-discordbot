FROM node:12
WORKDIR /app

# install dependecies
COPY package*.json ./
RUN npm install

# copy all project files
COPY . .

# run start script
CMD npm run start

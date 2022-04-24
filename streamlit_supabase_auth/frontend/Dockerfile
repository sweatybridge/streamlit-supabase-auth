FROM node:16

WORKDIR /frontend

COPY package.json .
COPY package-lock.json .
RUN npm install

CMD ["npm", "run", "start"]

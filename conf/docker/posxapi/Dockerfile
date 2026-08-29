FROM node:4.3
WORKDIR /usr/src/app
ENV PORT=80
COPY app /usr/src/app
RUN npm install
CMD ["node", "main.js"]
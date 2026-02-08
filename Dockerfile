FROM node:19
WORKDIR /work
COPY tsconfig.json .
COPY package.json .
COPY package-lock.json .
COPY src/index.ts src/
RUN npm install
RUN npm run tsc

ENTRYPOINT ["npm", "run"]
CMD ["start"]

FROM node:lts AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY .babelrc ./
COPY ./src/ ./src/
RUN yarn run build-server

FROM node:lts AS runtime

WORKDIR /app
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/dist/ ./dist/

CMD ["node", "dist/backend/server.js", "run"]

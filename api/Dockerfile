FROM node:17

WORKDIR /opt/web-wallet-api

COPY . /opt/web-wallet-api

RUN mkdir -p /data \
  && yarn install --dev

ENV DATABASE_URL "file:/data/data.db"
ENV AUTH0_DOMAIN "changeme"
ENV API_IDENTIFIER "changeme"

EXPOSE 4000

CMD ["sh", "-c", "yarn run prisma migrate deploy ; yarn run ts-node src/index.ts"]

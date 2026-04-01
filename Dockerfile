FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine AS base

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install

RUN chown -R appuser:appgroup /app

USER 2000

CMD [ "npm", "start" ]

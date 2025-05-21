FROM node:20.19-bullseye-slim

ENV NODE_ENV=production

RUN addgroup --gid 2000 --system appgroup && \
        adduser --uid 2000 --system appuser --gid 2000

WORKDIR /app

RUN apt-get update && \
        apt-get upgrade -y && \
        apt-get autoremove -y && \
        rm -rf /var/lib/apt/lists/*


COPY . .

RUN npm install

RUN chown -R appuser:appgroup /app

USER 2000

RUN chmod +x start.sh

CMD [ "npm", "start" ]

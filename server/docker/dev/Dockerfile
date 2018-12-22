FROM makajs/server:latest
WORKDIR /usr/local/server

COPY run.sh /usr/local/server/run.sh
RUN chmod a+x /usr/local/server/run.sh

COPY service /usr/local/server/service
COPY nodejs /usr/local/server/nodejs


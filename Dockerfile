FROM node:12.2.0-alpine

ENV UNO_URL https://raw.githubusercontent.com/dagwieers/unoconv/master/unoconv

WORKDIR /app

ADD . ${WORKDIR}

RUN apk --no-cache add python3 \
            curl \
            util-linux \
            libreoffice-common \
            libreoffice-writer \
            ttf-droid-nonlatin \
            ttf-droid \
            ttf-dejavu \
            ttf-freefont \
            ttf-liberation \
        && curl -Ls $UNO_URL -o /usr/local/bin/unoconv \
        && chmod +x /usr/local/bin/unoconv \
        && ln -s /usr/bin/python3 /usr/bin/python

RUN npm install -g yarn
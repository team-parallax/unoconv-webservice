FROM teamparallax/unoconv-alpine:v1.1.5

ARG host=http://localhost:3000/
ENV HOST=$host

ENV UNO_URL https://raw.githubusercontent.com/dagwieers/unoconv/master/unoconv

WORKDIR /app

ADD . ${WORKDIR}

RUN mkdir -p \
	test/input \
	test/out \
	input\
	out\
	&& npm install -g yarn \
	&& yarn install \
	&& yarn tsoa:create:docker

CMD ["yarn", "start"]

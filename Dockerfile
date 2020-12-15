FROM teamparallax/unoconv-alpine:v1.1.5

ARG host=http://localhost:3000/
ENV HOST=$host

ENV UNO_URL https://raw.githubusercontent.com/dagwieers/unoconv/master/unoconv

WORKDIR /app

ADD . ${WORKDIR}

# To handle 'not get uid/gid'
# @link https://stackoverflow.com/questions/52196518/could-not-get-uid-gid-when-building-node-docker
RUN npm config set unsafe-perm true

RUN mkdir -p \
	test/input \
	test/out \
	input\
	out\
	&& npm install -g yarn \
	&& yarn install \
	&& yarn tsoa:create:docker

CMD ["yarn", "start"]

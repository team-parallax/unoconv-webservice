FROM teamparallax/unoconv-alpine:1.2.0

ARG host=localhost:3000
ENV HOST=$host

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
	&& yarn install \
	&& yarn tsoa:create:docker

CMD ["yarn", "start"]

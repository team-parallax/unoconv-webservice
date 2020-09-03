FROM teamparallax/unoconv-alpine

ENV UNO_URL https://raw.githubusercontent.com/dagwieers/unoconv/master/unoconv

WORKDIR /app

ADD . ${WORKDIR}

RUN mkdir -p \
	test/input \
	test/out \
	input\
	out\
	&& npm install -g yarn \
	&& yarn install

CMD ["yarn", "start"]

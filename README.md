# teamparallax/unoconv-webservice

This project provides a webservice with a REST-API for file-conversions using unoconv.

## Prerequesites

In order to run the service locally `unoconv` and its dependencies need to be installed.
One can also run the service using docker, therefore `Docker` needs to be installed.

### Usage

If the above mentioned requirements are met one can run the service using the command:

```console
yarn run start
```

One can also build the webservice in a docker container by using the following command:

```console
# building the container image
yarn run build:docker

# running the container
yarn run start:docker
```

Or one could pull the image from [Dockerhub](https://hub.docker.com/repository/docker/teamparallax/unoconv-webservice) and run it afterwards.

```console
docker pull teamparallax/unoconv-webservice \
 && yarn run start:docker
```

### Swagger API

To see the API-documentation in development-environment one can go to `http://localhost:3000/#/api-docs`.

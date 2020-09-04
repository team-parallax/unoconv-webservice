# teamparallax/unoconv-webservice

This project provides a webservice with a REST-API for file-conversions using unoconv.

## Prerequisites

In order to run the service locally `unoconv` and its dependencies (libreoffice, python3) need to be installed.
One can also run the service using docker, therefore `Docker` needs to be installed.

### Usage

You can either build the service from its source files or use the built docker image. 

#### Building from source

If the above mentioned requirements are met one can run the service using the command:

```console
yarn run start
```

One can also build the webservice in a `docker` container by using the following command:

```console
# building the container image
yarn run build:docker

# running the container
yarn run start:docker
```

#### Using the built image

Or one could pull the image from [Dockerhub](https://hub.docker.com/repository/docker/teamparallax/unoconv-webservice) and run it afterwards.

```console
# Pull the image
docker pull teamparallax/unoconv-webservice

# Run the image
docker run \
    --name unoconv \
    -p 3000:3000 \
    teamparallax/unoconv-webservice
```

### Swagger API

To see the API-documentation in development-environment one can go to `http://localhost:3000/#/api-docs`.

FROM node:14-alpine

# Create a directory (to house our source files) and navigate to it.
WORKDIR /app

# Installing dockerize which can test and wait on the availability of a TCP host and port.
ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache openssl \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Installing bash.
RUN apk add --no-cache bash bash-doc bash-completion

# Copy over the package.json and lock file to the containers working directory.
COPY package*.json ./package-lock.json ./tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

# Copy everything in the host folder into the working folder of the container.

EXPOSE 3000
# Nginx com Node.js

## Descrição do projeto 

Nesse desafio você colocará em prática o que aprendemos em relação a utilização do nginx como proxy reverso. A idéia principal é que quando um usuário acesse o nginx,
o mesmo fará uma chamada em nossa aplicação node.js. Essa aplicação por sua vez adicionará um registro em nosso banco de dados mysql, cadastrando um nome na tabela people.

O retorno da aplicação node.js para o nginx deverá ser:

<h1>Full Cycle Rocks!</h1>

- Lista de nomes cadastrada no banco de dados.

Gere o docker-compose de uma forma que basta apenas rodarmos: docker-compose up -d que tudo deverá estar funcionando e disponível na porta: 8080.

Não esqueça de colocar o volume na aplicação para o ambiente de desenvolvimento. 

Suba tudo em um repositório e faça a entrega.

* A linguagem de programação para este desafio é Node/JavaScript.

## Utilizando o multi-stage build para compilar a aplicação e otimizar a imagem

## dockerfile nginx 

- Stage 1

```
# Iniciando uma imagem base nginx
FROM nginx

# Definindo versao dockerize
ENV DOCKERIZE_VERSION=v0.7.0

# Rodando instalacao dockerize
RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*

# Copiando arquivo de configuracao do server nginx
COPY default.conf /etc/nginx/conf.d/default.conf

```
- Stage 2: server conf
```
# configuration of the server
server {
    # the port your site will be served on
    listen      80 default_server;
    listen [::]:80 default_server;
    # the domain name it will serve for
    server_name localhost; # substitute your machine's IP address or FQDN
    charset     utf-8;

    # max upload size
    client_max_body_size 75M;   # adjust to taste

    location / {
        proxy_http_version 1.1;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # the real magic is here where we forward requests to the address that the Node.js server is running on
        proxy_pass http://app:5000;
    }
}
```

## dockerfile node

```
# Iniciando uma imagem base node
FROM node:alpine

# Definindo pasta de trabalho default
WORKDIR /usr/src/app

# Definindo versao dockerize
ENV DOCKERIZE_VERSION=v0.7.0

# Rodando instalacao dockerize
RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget

# Copiando arquivos para executar a isntalacao das dependencias
COPY . .
RUN npm install

#expondo a porta para acesso entre containers
EXPOSE 5000
```

## docker-compose.yaml

```
version: '3'

services:

  nginx:
    build: 
      context: ./nginx
    container_name: nginx
    entrypoint: dockerize -wait tcp://db:3306 -timeout 20s /docker-entrypoint.sh nginx -g 'daemon off;'
    tty: true
    networks:
      - nodenet
    ports:
      - "8080:80"
    depends_on:
      - db
      - app

  app:
    build: 
      context: node
    container_name: app
    entrypoint: dockerize -wait tcp://db:3306 -timeout 20s node index.js
    tty: true
    networks:
      - nodenet
    depends_on:
      - db

  db:
    image: mysql:5.7
    command: --innodb-use-native-aio=0
    container_name: db
    restart: always
    tty: true
    volumes:
      - ./mysql:/var/lib/mysql
    environment:
      - MYSQL_DATABASE=nodedb
      - MYSQL_ROOT_PASSWORD=root
    networks:
      - nodenet

networks:
  nodenet:
    driver: bridge
```

## Run docker-compose

```
docker-compose up -d --build
```
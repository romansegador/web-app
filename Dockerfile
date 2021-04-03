FROM node:14.8.0-stretch-slim as build-env
WORKDIR /app
COPY ["package.json","package-lock.json","/app/"]
RUN npm install
RUN npm install -g @angular/cli

COPY . /app
#ENTRYPOINT ["ng","--version"]
RUN ng build
CMD ng serve --proxy-config proxy.conf.docker.json --host 0.0.0.0 --port 4200

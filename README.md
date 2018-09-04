# figured-blog-exercise

Welcome to README file of the blog exercise challenge. I will try to go straight to the point so we have fun!

## requirements

- php 7.*
- mongodb
- mysql
- nodejs

## install/publish

[1] Create .env file at `lvl-rest/.env`

Observe database configurations. We are using MySQL for users and MongoDB for 
everything else. Then, database configuration is mandatory as example: 

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=homestead
DB_USERNAME=homestead
DB_PASSWORD=secret

MONGO_DB_HOST=127.0.0.1
MONGO_DB_PORT=27017
MONGO_DB_DATABASE=homestead
MONGO_DB_USERNAME=
MONGO_DB_PASSWORD=
```

[2] Execute:

`sh publish.sh`

(optional) seed: `cd lvl-rest && php artisan db:seed`

[3] Use your preferred web server from the project root folder (Ex: `php -S localhost:8080`). 
The web server should recognise htaccess files. 

[4] Login with default admin user created using route `login` (Ex: `localhost:8080/ngjs/login`).
Credentials are:

- login: `admin@figured.com`
- password: `exercise`

[5] Enjoy.

## structure

 - `ngjs/` - angular.js client application
 - `lvl-rest/` - laravel rest server application

## environment

### laravel

1) application creation

The application was created using composer `create-aplication laravel/laravel` command.



# figured-blog-exercise

Welcome to README file of the blog exercise challenge. I will try to go straight to the point so we have fun!

## install/publish

1) Create .env file at `lvl-rest/.env`

2) Execute:

`sh publish.sh`

3) Use your preferred web server from the project root folder (Ex: `php -S localhost:8080`). 
The web server should recognise htaccess files. 

4) Login with default admin user created using route `login` (Ex: `localhost:8080/ngjs/login`).
Credentials are:

- login: `admin@figured.com`
- password: `exercise`

## structure

 - `ngjs/` - angular.js client application
 - `lvl-rest/` - laravel rest server application

## environment

### laravel

1) application creation

The application was created using composer `create-aplication laravel/laravel` command.



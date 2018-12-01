FROM php:7.2-apache
RUN apt-get update \
    && apt-get install -y libpq-dev libpq5 mongodb \
    # enable htaccess \
    && a2enmod rewrite expires \
    #&& a2enmod expires \
    && docker-php-source extract \
    # do important things \
    && docker-php-ext-install pdo_pgsql pgsql \
    && docker-php-source delete
WORKDIR /var/www/html
COPY . /var/www/html
EXPOSE 80
#CMD cd /var/www/html \
#    && php composer.phar install \
#    && cd app18 \
#    && php composer.phar install \
#    && php artisan config:clear \
#    && php artisan cache:clear \
#    && php artisan migrate --database=pgsql_migrate
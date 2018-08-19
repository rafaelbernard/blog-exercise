#!/bin/bash
if [ ! -f lvl-rest/.env ]; then
    echo "Create lvl-rest.env file"
    exit;
fi
cd lvl-rest && php composer.phar install
php artisan migrate
cd ../ngjs/build && npm run-script publish
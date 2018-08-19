#!/bin/bash
cd lvl-rest && php composer.phar install
php artisan migrate
cd ../ngjs/build && npm run-script publish
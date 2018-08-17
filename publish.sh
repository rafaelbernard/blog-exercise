#!/bin/bash
cd lvl-rest && php composer.phar install && php composer.phar update
cd ../ngjs/build && npm run-script publish
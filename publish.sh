#!/bin/bash
cd lvl-rest && php composer.phar install
cd ../ngjs/build && npm run-script publish
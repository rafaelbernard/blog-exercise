<?php

use Faker\Generator as Faker;

$factory->define(App\Post::class, function (Faker $faker) {
    return [
        'title'        => $faker->word . ' ' . uniqid(),
        'content'      => $faker->text,
        'is_published' => 1,
        'user_id'      => 1
    ];
});

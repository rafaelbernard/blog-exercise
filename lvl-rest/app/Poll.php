<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Poll extends Model
{

    protected $fillable = [
        'title', 'published_date', 'answer'
    ];
}

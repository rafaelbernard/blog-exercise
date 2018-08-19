<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Comment extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'comments';

    public function posts()
    {
        $this->belongsTo('App\Post');
    }
}

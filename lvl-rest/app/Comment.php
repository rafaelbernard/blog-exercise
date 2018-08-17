<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{

    public function posts()
    {
        $this->belongsTo('App\Post');
    }
}

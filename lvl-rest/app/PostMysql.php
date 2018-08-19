<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PostMysql extends Model
{
    protected $fillable = ['title', 'content', 'is_published', 'user_id'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function comments()
    {
        return $this->hasMany('App\Comment');
    }
}

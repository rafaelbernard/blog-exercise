<?php

use Illuminate\Support\Facades\Schema;
//use Illuminate\Database\Schema\Blueprint;
use Jenssegers\Mongodb\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostsTable extends Migration
{

    protected $connection = 'mongodb';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
//        Schema::create('posts', function (Blueprint $table) {
//            $table->increments('id');
//            $table->timestamps();
//            $table->string('title')->unique();
//            $table->text('content');
//            $table->integer('user_id');
//            $table->boolean('is_published');
//        });
        Schema::connection($this->connection)
            ->table('posts', function (Blueprint $table) {
//                $table->increments('id');
//                $table->timestamps();
//                $table->string('title')->unique();
//                $table->text('content');
//                $table->integer('user_id');
//                $table->boolean('is_published');
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection($this->connection)
            ->dropIfExists('posts');
    }
}

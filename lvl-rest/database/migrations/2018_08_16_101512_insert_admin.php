<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InsertAdmin extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Insert some stuff
            DB::table('users')->insert(
                array(
                    'email'    => 'admin@figured.com',
                    'password' => bcrypt('exercise'),
                    'name'     => 'admin'
                )
            );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            DB::table('users')->where('email', '=', 'admin@figured.com')->delete();
        });
    }
}

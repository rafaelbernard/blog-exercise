<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//Route::post('/post', [
//    'uses'       => 'PostController@create',
//    'as'         => 'post.create',
//    'middleware' => 'auth'
//]);

//Route::resource('post', 'PostController', [
//    //'only' => ['index', 'show', 'store']
//    'except' => ['create', 'edit']
//]);

Route::prefix('v1')->group(function () {
    Route::resource('post', 'PostController', [
        'except' => ['edit', 'create']
    ]);

    Route::resource('user', 'AuthController', [
        'only' => ['store', 'signin', 'index']
    ]);

//    Route::resource('user', '', [
//        'uses' => 'AuthController@store'
//    ]);
//
//    Route::post('user/signin', [
//        'uses' => 'AuthController@signin'
//    ]);
});

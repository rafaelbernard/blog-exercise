<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function store(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email',
            'name'     => 'required',
            'password' => 'required|min:5'
        ]);

        $email    = $request->input('email');
        $password = $request->input('password');
        $name     = $request->input('name');
        return "It works!";
    }

    public function signin(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email',
            'password' => 'required|min:5'
        ]);

        $email    = $request->input('email');
        $password = $request->input('password');

        $user = ['email' => $email];

        $response = [
            'msg'  => 'User signed in',
            'user' => $user
        ];

        return $response;

        return "It works!";
    }
}

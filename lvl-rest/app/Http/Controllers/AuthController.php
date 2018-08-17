<?php

namespace App\Http\Controllers;

use App\User;
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

        $user = new User([
            'name'     => $name,
            'email'    => $email,
            'password' => bcrypt($password)
        ]);

        if ($user->save())
        {
            $user->signin = [
                'href'   => 'api/v1/user/signin',
                'method' => 'POST',
                'params' => 'email, password'
            ];

            $response = [
                'msg'  => 'User created',
                'user' => $user
            ];

            return response()->json($response, 201);
        }

        $response = [
            'msg'  => 'An erro ocurred while creating the user'
        ];

        return response()->json($response, 404);
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

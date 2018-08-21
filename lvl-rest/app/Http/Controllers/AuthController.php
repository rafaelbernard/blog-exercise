<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth',
            [
                'except' =>
                    [
                        'signin'
                    ]
            ]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'email'            => 'required|email|unique:users',
            'name'             => 'required',
            'password'         => 'required|min:5',
            'confirm_password' => 'required|min:5'
        ]);

        $email            = $request->input('email');
        $password         = $request->input('password');
        $confirm_password = $request->input('confirm_password');
        $name             = $request->input('name');

        if (!($password === $confirm_password))
        {
            $response = [
                'message' => 'Passwords does not match'
            ];

            return response()->json($response, 404);
        }

//        $user_same_email = User::where('email', $email)->first();
//
//        if ($user_same_email)
//        {
//            return response()->json(['message' => 'There is already a user using this e-mail'], 500);
//        }

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
                'message' => 'User created',
                'user'    => $user
            ];

            return response()->json($response, 201);
        }

        $response = [
            'message' => 'An erro ocurred while creating the user'
        ];

        return response()->json($response, 404);
    }

    public function signin(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email',
            'password' => 'required|min:5'
        ]);

        $credentials = $request->only('email', 'password');

        try
        {
            if (!$token = JWTAuth::attempt($credentials))
            {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e)
        {
            return response()->json(['message' => 'Could not create token'], 500);
        }

        $user = User::where('email', $request->input('email'))->firstOrFail();

        $response = [
            'message' => 'Success',
            'user'    => $user,
            'token'   => $token];

        return response()->json($response, 200);
    }

    public function index()
    {
        $users = User::all();

        foreach ($users as $user)
        {
            $user->view_post = [
                'href'   => "api/v1/user/{$user->id}",
                'method' => 'GET'
            ];
        }

        $response = [
            'message' => 'List of users',
            'users'   => $users
        ];

        return response()->json($response, 200);
    }

    // @todo app install endpoint
//    public function install()
//    {
//        $response = [
//            'message'     => 'Install allowed',
//            'install' => 'ok'
//        ];
//
//        return response()->json($response, 200);
//    }
}

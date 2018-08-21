<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserSigninRequest;
use App\Http\Requests\UserStoreRequest;
use App\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['signin']]);
    }

    public function store(UserStoreRequest $request)
    {
        $email            = $request->input('email');
        $password         = $request->input('password');
        $confirm_password = $request->input('confirm_password');
        $name             = $request->input('name');

        if (!($password === $confirm_password))
        {
            $response = [
                'message' => 'Passwords does not match'
            ];

            return response()->json($response, 422);
        }

        $user = new User([
            'name'     => $name,
            'email'    => $email,
            'password' => bcrypt($password)
        ]);

        if ($user->save())
        {
            $response = [
                'message' => 'User created',
                'user'    => $user
            ];

            return response()->json($response, 201);
        }

        $response = [
            'message' => 'An error ocurred while creating the user'
        ];

        return response()->json($response, 422);
    }

    public function signin(UserSigninRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials))
        {
            return response()->json(['message' => 'Invalid credentials'], 403);
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

        $response = [
            'message' => 'List of users',
            'users'   => $users
        ];

        return response()->json($response, 200);
    }

}

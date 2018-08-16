<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function store(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');
        $name     = $request->input('name');
        return "It works!";
    }

    public function signin(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');
        return "It works!";
    }
}

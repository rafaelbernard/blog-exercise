<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use JWTAuth;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Return request headers needed to interact with the API.
     *
     * @return array array of headers.
     */
    protected function JWTTokenHeaders($user = NULL)
    {
        $headers = ['Accept' => 'application/json'];

        if ($user !== NULL)
        {
            $token = JWTAuth::fromUser($user);
            JWTAuth::setToken($token);
            $headers['Authorization'] = 'Bearer ' . $token;
        }

        return $headers;
    }
}

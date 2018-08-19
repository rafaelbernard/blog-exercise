<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testExample()
    {
        $this->assertTrue(TRUE);
    }

    public function testUsersListWithDraftWithoutToken()
    {
        $response = $this->get('api/v1/user');

        $response->assertStatus(400);
    }

    public function testUsersPostWithDraftWithoutToken()
    {
        $response = $this->post('api/v1/user', ['name' => 'fake name']);

        $response->assertStatus(400);
    }
}

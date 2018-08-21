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

    public function testSiginWithAdminFigured()
    {
        //$credential     = ['email' => 'admin@figured.com', 'password' => 'exercise'];
        //$response = $this->post('api/v1/user/signin', $credential);

        $user = factory(\App\User::class)->create();

        $credential = ['email' => $user->email, 'password' => 'secret'];
        $response   = $this->post('api/v1/user/signin', $credential);

        $response->assertJson(['message' => 'Success'])->assertOk();
    }
}

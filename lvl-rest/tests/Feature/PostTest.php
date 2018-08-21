<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use JWTAuth;

class PostTest extends TestCase
{

    public function testPostsList()
    {
        $response = $this->get('api/v1/post');

        $response->assertStatus(200);
    }

    public function testPostsListWithDraftWithoutToken()
    {
        $response = $this->get('api/v1/post?withDraft=true');

        $response->assertForbidden()->assertSee('This action is unauthorized.');
    }

    public function testProductStoreWithoutToken()
    {
        $post = factory(\App\Post::class)->make();

        $response = $this->post('api/v1/post', $post->jsonSerialize());

        $response->assertStatus(400)->assertSee('token_not_provided');
    }

    public function testProductStore()
    {
        $user = \App\User::first();
        $post = factory(\App\Post::class)->make();

        $response = $this->post('api/v1/post', $post->jsonSerialize(), $this->JWTTokenHeaders($user));

        $response->assertStatus(201);
    }

    public function testProductUpdateWithoutToken()
    {
        $post = \App\Post::first();

        $response = $this->patch("api/v1/post/{$post->_id}", $post->jsonSerialize());

        $response->assertStatus(400)->assertSee('token_not_provided');
    }

    public function testProductUpdate()
    {
        $user = \App\User::first();
        $post = \App\Post::first();

        $response = $this->patch("api/v1/post/{$post->_id}", $post->jsonSerialize(), $this->JWTTokenHeaders($user));

        $response->assertStatus(200);
    }
}

<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

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

        $response->assertStatus(500);
    }

    public function testProductCreation()
    {
        $user = factory(\App\User::class)->make();
        $post = factory(\App\Post::class)->make();

        $response = $this->actingAs($user)
            ->post(route('post.store'), $post->jsonSerialize());

        $response->assertStatus(201);
    }
}

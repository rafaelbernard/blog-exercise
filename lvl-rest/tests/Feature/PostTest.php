<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

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
}

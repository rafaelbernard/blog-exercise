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

        // @todo also create test with fake data
//        $posts = factory(\App\Post::class, 3)->create();
//
//        array_map(function ($post) {
//            $this->seeJson($post->jsonSerialize());
//        }, $posts->all());
    }

    public function testPostsListWithDraftWithoutToken()
    {
        $response = $this->get('api/v1/post?withDraft=true');

        $response->assertStatus(500);
    }
}

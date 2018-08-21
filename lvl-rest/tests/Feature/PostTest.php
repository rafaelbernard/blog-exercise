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

//    public function testProductCreation()
//    {
//        $user = factory(\App\User::class)->make();
//        $post = factory(\App\Post::class)->make();
//
//        $response = $this->actingAs($user)
//            ->post(route('post.store'), $post->jsonSerialize());
//
//        $response->assertStatus(201);
//    }

    public function testProductCreationFailsWhenTitleNotProvided()
    {
        $user = factory(\App\User::class)->create();
        //$post = factory(\App\Post::class)->create();

        //$response = $this->actingAs($user)->post(route('post.store'), $post->jsonSerialize());

        $post = factory(\App\Post::class)->make(['title' => '']);

        //$response = $this->withHeaders(['X-Requested-With', 'XMLHttpRequest'])->post(route('post.store'), $post->jsonSerialize());
        $response = $this->actingAs($user)->post(route('post.store'), $post->jsonSerialize());

        $response
            ->assertJson(['title'=>['The title field is required']])
            ->assertStatus(422);
    }

//    public function testProductUpdate()
//    {
//        $user = factory(\App\User::class)->make();
//        $post = factory(\App\Post::class)->make();
//
//        $post->name = $post->name . ' ' . str_random(10);
//
//        $response = $this->actingAs($user)
//            ->post(route('post.update'), $post->jsonSerialize());
//
//        $response->assertStatus(200);
//    }
}

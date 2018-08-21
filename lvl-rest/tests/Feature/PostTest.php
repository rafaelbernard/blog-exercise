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

//    public function testProductCreationFailsWhenTitleNotProvided()
//    {
//        //$user = factory(\App\User::class)->create();
//        //$user = factory(\App\User::class)->make(['email' => 'admin@figured.com', 'password' => 'exercise']);
//
//        $post = factory(\App\Post::class)->make(['title' => '']);
//
//        //$response = $this->actingAs($user)->post(route('post.store'), $post->jsonSerialize());
//        $response = $this->post(route('post.store'), $post->jsonSerialize());
//
//        $response
//            ->assertJsonFragment(['title' => ['The title field is required.']])
//            ->assertStatus(422);
//    }

//    public function testProductCreationFailsWhenTitleNotUnique()
//    {
//        $user = factory(\App\User::class)->create();
//
//        $title = 'Some title ' . uniqid();
//        $post1 = factory(\App\Post::class)->create(['title' => $title]);
//        $post2 = factory(\App\Post::class)->make(['title' => $title]);
//
//        //$response = $this->withHeaders(['X-Requested-With', 'XMLHttpRequest'])->post(route('post.store'), $post->jsonSerialize());
//        //$response = $this->actingAs($user)->post(route('post.store'), $post2->jsonSerialize());
//        //$response = $this->post('api/v1/post', $post2->jsonSerialize());
//        $response = $this->post('api/v1/post', ['title' => $title]);
//
//        $response
//            ->assertJson(['message' => 'The given data was invalid.'])
//            //->assertJsonFragment(['title'=>['The title field is required']])
//            ->assertStatus(422);
//    }

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

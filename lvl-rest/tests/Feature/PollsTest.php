<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PollsTest extends TestCase
{
    /** @test */
    public function list_all()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('api/v1/polls');

        $response->assertStatus(200)
            ->assertJsonStructure([['published_date']]);
    }
}

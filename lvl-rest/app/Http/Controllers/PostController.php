<?php

namespace App\Http\Controllers;

use App\Post;
use App\User;
use Illuminate\Http\Request;
use JWTAuth;

class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth',
            ['except' =>
                 ['index', 'show']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $withDraft = $request->query('withDraft');

        if ($withDraft === 'true')
        {
            if (!$user = JWTAuth::parseToken()->authenticate())
            {
                return response()->json(['message' => 'You must be logged in'], 404);
            }

            $posts = Post::with('user')->get()->sortBy('updated_at');
        } else
        {
            $posts = Post::with('user')->get()->where('is_published', 1)->sortBy('updated_at');
        }

        foreach ($posts as $post)
        {
            //$post->user = User::where('id', $post->user_id)->first();

            $post->view_post = [
                'href'   => "api/v1/post/{$post->_id}",
                'method' => 'GET'
            ];
        }

        $response = [
            'message' => 'List of posts',
            'posts'   => $posts
        ];

        return response()->json($response, 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'title'   => 'required',
            'content' => 'required',
            //'user_id' => 'required'
        ]);

        if (!$user = JWTAuth::parseToken()->authenticate())
        {
            return response()->json(['message' => 'User not found'], 404);
        }

        $title        = $request->input('title');
        $content      = $request->input('content');
        $is_published = $request->input('is_published');
        $user_id      = $user->id;
        //$user_id      = $request->input('user_id');

        $post = new Post([
            'title'        => $title,
            'content'      => $content,
            'is_published' => $is_published,
            'user_id'      => $user_id
        ]);

        if ($post->save())
        {
            $post->user()->associate($user_id);

            $post->view_post = [
                'href'   => 'api/v1/post/' . $post->_id,
                'method' => 'GET'
            ];

            $response = [
                'message' => 'Post created',
                'post'    => $post
            ];

            return response()->json($response, 201);
        }

        $response = [
            'message' => 'An error ocurred while creating the post'
        ];

        return response()->json($response, 404);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $post = Post::where('_id', $id)->with('user')->first();

        if (!$post)
        {
            return response()->json(['message' => 'Post not found'], 404);
        }

        if (!$post->is_published)
        {
            return response()->json(['message' => 'Post not found'], 401);
        }

        $post->view_post = [
            'href'   => "api/v1/post/{$post->_id}",
            'method' => 'GET'
        ];

        $response = [
            'message' => 'the_post',
            'post'    => $post
        ];

        return response()->json($response, 200);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'title'   => 'required',
            'content' => 'required',
        ]);

        if (!$user = JWTAuth::parseToken()->authenticate())
        {
            return response()->json(['message' => 'User not found'], 404);
        }

        $title        = $request->input('title');
        $content      = $request->input('content');
        $is_published = $request->input('is_published');

        $post = Post::with('user')->findOrFail($id);

        $post->title        = $title;
        $post->content      = $content;
        $post->is_published = $is_published;

        if ($post->update())
        {
            //$post->user()->associate($user_id);

            $post->view_post = [
                'href'   => 'api/v1/post/' . $post->_id,
                'method' => 'GET'
            ];

            $response = [
                'message' => 'Post updated',
                'post'    => $post
            ];

            return response()->json($response, 201);
        }

        $response = [
            'message' => 'An error ocurred while updating the post'
        ];

        return response()->json($response, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy($id)
    {
        $post = Post::with('user')->findOrFail($id);

        if (!$user = JWTAuth::parseToken()->authenticate())
        {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!$post->user()->where('users.id', $user->id)->first())
        {
            return response()->json(['message' => 'User is not the same that created the post'], 401);
        }

        if (!$post->delete())
        {
            return response()->json(['message' => 'Deleting failed'], 404);
        }

        $response = [
            'message' => 'post deleted',
            'create'  => [
                'href'   => 'public/api/v1/post',
                'method' => 'POST',
                'params' => 'title, content, is_published, user_id'
            ]
        ];

        return response()->json($response, 200);
    }
}

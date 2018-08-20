<?php

namespace App\Http\Controllers;

use App\Post;
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

            $posts = Post::with('user')->orderBy('updated_at', 'DESC')->get();
        } else
        {
            $posts = Post::with('user')->orderBy('updated_at', 'DESC')->get()->where('is_published', 1);
        }

        foreach ($posts as $post)
        {
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
            'title'        => 'required',
            'content'      => 'required',
            'is_published' => 'required'
        ]);

        if (!$user = JWTAuth::parseToken()->authenticate())
        {
            return response()->json(['message' => 'User not found'], 404);
        }

        $title        = $request->input('title');
        $content      = $request->input('content');
        $is_published = $request->input('is_published');
        $user_id      = $user->id;

        $post_same_title = Post::where('title', $title)->first();

        if ($post_same_title)
        {
            return response()->json(['message' => 'There is already a post with the same title'], 500);
        }

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

        $post_same_title = Post::where('title', $title)->where('_id', '!=', $id)->first();

        if ($post_same_title)
        {
            return response()->json(['message' => 'There is already a post with the same title'], 500);
        }

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

<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;
use JWTAuth;

class PostController extends Controller
{
    public function __construct()
    {
//        $this->middleware('jwt.auth',
//            ['only' => [
//                'store', 'update', 'destroy'
//            ]]);

        $this->middleware('jwt.auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts = Post::all();

        foreach ($posts as $post)
        {
            $post->view_post = [
                'href'   => "api/v1/post/{$post->id}",
                'method' => 'GET'
            ];
        }

        $response = [
            'msg'   => 'List of posts',
            'posts' => $posts
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
            return response()->json(['msg' => 'User not found'], 404);
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
                'href'   => 'api/v1/post/' . $post->id,
                'method' => 'GET'
            ];

            $response = [
                'msg'  => 'Post created',
                'post' => $post
            ];

            return response()->json($response, 201);
        }

        $response = [
            'msg' => 'An error ocurred while creating the post'
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
        $post = Post::with('user')->where('id', $id)->firstOrFail();

        $post->view_post = [
            'href'   => "api/v1/post/{$post->id}",
            'method' => 'GET'
        ];

        $response = [
            'msg'  => 'the_post',
            'post' => $post
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
            return response()->json(['msg' => 'User not found'], 404);
        }

        $title        = $request->input('title');
        $content      = $request->input('content');
        $is_published = $request->input('is_published');
        $user_id      = $user->id;

        $post = Post::with('user')->findOrFail($id);

        if (!$post->user()->where('users.id', $user_id)->first())
        {
            return response()->json(['msg' => 'User is not the same that created the post. Fail.'], 401);
        }

        $post->title   = $title;
        $post->content = $content;

        if ($post->update())
        {
            //$post->user()->associate($user_id);

            $post->view_post = [
                'href'   => 'api/v1/post/' . $post->id,
                'method' => 'GET'
            ];

            $response = [
                'msg'  => 'Post updated',
                'post' => $post
            ];

            return response()->json($response, 201);
        }

        $response = [
            'msg' => 'An error ocurred while updating the post'
        ];

        return response()->json($response, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        if (!$user = JWTAuth::parseToken()->authenticate())
        {
            return response()->json(['msg' => 'User not found'], 404);
        }

        if (!$post->delete())
        {
            return response()->json(['msg' => 'Deleting failed'], 404);
        }

        $response = [
            'msg'    => 'post deleted',
            'create' => [
                'href'   => 'public/api/v1/post',
                'method' => 'POST',
                'params' => 'title, content, is_published, user_id'
            ]
        ];

        return response()->json($response, 200);
    }
}

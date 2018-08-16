<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return "It works!";
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
            'userId'  => 'required'
        ]);

        $title       = $request->input('title');
        $content     = $request->input('content');
        $isPublished = $request->input('isPublished');
        $userId      = $request->input('userId');

        $post = [
            'title'    => $title,
            'content'  => $content,
            'userId'   => $userId,
            'viewPost' => [
                'href'   => 'api/v1/post/999',
                'method' => 'GET'
            ]
        ];

        $response = [
            'msg'  => 'created',
            'post' => $post
        ];

        return response()->json($response, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return ['msg' => 'ok', 'id' => $id];
        return response()->json();
        return "It works! $id";
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
            'userId'  => 'required'
        ]);

        $title       = $request->input('title');
        $content     = $request->input('content');
        $isPublished = $request->input('isPublished');
        $userId      = $request->input('userId');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //

        $response = [
            'msg'    => 'post deletede',
            'create' => [
                'href'   => 'api/v1/post',
                'method' => 'POST',
                'params' => 'title, content, is_published'
            ]
        ];

        return $response;
    }
}

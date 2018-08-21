<?php

namespace App\Http\Requests;

use App\Post;
use Illuminate\Foundation\Http\FormRequest;

class PostUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return TRUE;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title'        => 'required',
            'content'      => 'required',
            'is_published' => 'required'
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            if (Post::where([['title', $this->input('title')], ['_id', '!=', $this->route('post')]])->first())
            {
                $validator->errors()->add('title', 'There is already a post with the same title');
            }
        });
    }
}

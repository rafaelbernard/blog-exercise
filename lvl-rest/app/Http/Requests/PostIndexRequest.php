<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use JWTAuth;

class PostIndexRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $withDraft = $this->query('withDraft');

        if ($withDraft && $withDraft === 'true')
        {
            try
            {
                JWTAuth::parseToken()->authenticate();
            } catch (\Exception $e)
            {
                return FALSE;
            }
        }

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
            //
        ];
    }
}

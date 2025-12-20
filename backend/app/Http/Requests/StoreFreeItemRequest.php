<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFreeItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'required_purchase_amount' => 'required|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'description' => 'nullable|string|max:1000',
            'eligible_items' => 'sometimes|array',
            'eligible_items.*' => 'integer|exists:items,id',
            'selectable_items' => 'sometimes|array',
            'selectable_items.*' => 'integer|exists:items,id',
        ];
    }
}

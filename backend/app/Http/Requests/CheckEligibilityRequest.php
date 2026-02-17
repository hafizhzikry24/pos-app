<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckEligibilityRequest extends FormRequest
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
            'purchase_amount' => 'required|numeric|min:0',
            'cart_items' => 'sometimes|array',
            'cart_items.*.item_id' => 'required|integer|exists:items,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
            'number' => 'required|string|unique:receipts,number',
            'location_id' => 'required|exists:locations,id',
            'cashier_id' => 'required|exists:cashiers,id',
            'customer_id' => 'nullable|exists:customers,id',
            'total_amount' => 'required|numeric',
            'discount_amount' => 'nullable|numeric',
            'tax_amount' => 'nullable|numeric',
            'payable_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'note' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'items.*.discount' => 'nullable|numeric',
            'items.*.total' => 'required|numeric',
        ];
    }
}

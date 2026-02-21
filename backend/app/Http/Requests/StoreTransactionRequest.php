<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'change_amount' => 'nullable|numeric',
            'payment_method' => 'required|string',
            'note' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.discount' => 'nullable|numeric',
            'items.*.total' => 'required|numeric',
            'items.*.is_free_item' => 'nullable|boolean',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $items = $this->input('items', []);
            
            foreach ($items as $index => $item) {
                // For regular items (not free), validate item_id and price
                if (!($item['is_free_item'] ?? false)) {
                    if (empty($item['item_id']) || $item['item_id'] == 0) {
                        $validator->errors()->add("items.{$index}.item_id", 'Item ID is required for regular items.');
                    } else {
                        // Check if item exists in database
                        if (!\DB::table('items')->where('id', $item['item_id'])->exists()) {
                            $validator->errors()->add("items.{$index}.item_id", 'The selected item is invalid.');
                        }
                    }
                    
                    if (!isset($item['price']) || $item['price'] == 0) {
                        $validator->errors()->add("items.{$index}.price", 'Price is required for regular items.');
                    }
                } else {
                    // For free items, validate item_id exists (but allow 0 as fallback)
                    if (!empty($item['item_id']) && $item['item_id'] != 0) {
                        // Check if item exists in database
                        if (!\DB::table('items')->where('id', $item['item_id'])->exists()) {
                            $validator->errors()->add("items.{$index}.item_id", 'The selected free item is invalid.');
                        }
                    }
                }
            }
        });
    }
}

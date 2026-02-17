<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Services\ReceiptService;
use Illuminate\Http\Request;
use Exception;

class ReceiptController extends Controller
{
    protected $service;

    public function __construct(ReceiptService $service)
    {
        $this->service = $service;
    }

    /**
     * Store a new transaction.
     */
    public function store(Request $request)
    {
        $request->validate([
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
        ]);

        try {
            $receiptData = $request->only([
                'number',
                'location_id',
                'cashier_id',
                'customer_id',
                'total_amount',
                'discount_amount',
                'tax_amount',
                'payable_amount',
                'payment_method',
                'note'
            ]);

            $receipt = $this->service->createTransaction($receiptData, $request->items);

            return response()->json([
                'success' => true,
                'message' => 'Transaction processed successfully',
                'data' => $receipt
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified receipt.
     */
    public function show($id)
    {
        try {
            $receipt = $this->service->getReceiptById($id);
            return response()->json([
                'success' => true,
                'data' => $receipt
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Receipt not found'
            ], 404);
        }
    }
}

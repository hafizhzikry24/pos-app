<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Responses\MessageResponse;
use App\Services\ReceiptService;
use Exception;
use Illuminate\Http\JsonResponse;

class ReceiptController extends Controller
{
    protected $service;

    public function __construct(ReceiptService $service)
    {
        $this->service = $service;
    }

    /**
     * Store a new transaction.
     * @param StoreTransactionRequest $request
     * @return JsonResponse
     */
    public function store(StoreTransactionRequest $request): JsonResponse
    {
        try {
            $receipt = $this->service->createTransaction($request->validated(), $request->items);
            return MessageResponse::success($receipt, 'Transaction processed successfully', 201);
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * Display the specified receipt.
     * @param int|string $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $receipt = $this->service->getReceiptById($id);
            return MessageResponse::success($receipt, 'Receipt retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::error('Receipt not found', 404);
        }
    }
}

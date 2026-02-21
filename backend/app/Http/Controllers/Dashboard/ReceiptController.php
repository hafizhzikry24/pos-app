<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
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
     * Display a listing of receipts.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $receipts = $this->service->getAllReceipts();
            return MessageResponse::success($receipts, 'Receipts retrieved successfully');
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

    /**
     * Remove the specified receipt from storage.
     * @param int|string $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->service->deleteReceipt($id);
            return MessageResponse::success(null, 'Receipt deleted successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers\Dashboard;

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
     * Display a listing of receipts.
     */
    public function index()
    {
        try {
            $receipts = $this->service->getAllReceipts();
            return response()->json([
                'success' => true,
                'data' => $receipts
            ]);
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

    /**
     * Remove the specified receipt from storage.
     */
    public function destroy($id)
    {
        try {
            $this->service->deleteReceipt($id);
            return response()->json([
                'success' => true,
                'message' => 'Receipt deleted successfully'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

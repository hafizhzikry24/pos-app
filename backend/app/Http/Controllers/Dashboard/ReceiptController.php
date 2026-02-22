<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Responses\MessageResponse;
use App\Services\ReceiptService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
    public function index(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search');
            $date = $request->get('date');
            $perPage = $request->get('per_page', 10);
            
            $receipts = $this->service->getPaginatedWithSearch($search, $date, $perPage);
            return MessageResponse::success($receipts, 'Receipts retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * Display the specified receipt.
     * 
     * @param int|string $id
     * @param Request $request
     * @return JsonResponse
     */
    public function show($id, Request $request): JsonResponse
    {
        try {
            $tableSuffix = $request->input('table');
            
            if ($tableSuffix && $tableSuffix !== 'original') {
                // Get receipt from specific sharded table
                $date = \Carbon\Carbon::createFromFormat('Ym', $tableSuffix);
                $receipt = $this->service->getReceiptByIdAndDate($id, $date->format('Y-m'));
            } else {
                // Get receipt from all tables (original + sharded)
                $receipt = $this->service->getReceiptById($id);
            }

            return MessageResponse::success($receipt, 'Receipt retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::error('Receipt not found', 404);
        }
    }

    /**
     * Remove the specified receipt from storage.
     * 
     * @param int|string $id
     * @param Request $request
     * @return JsonResponse
     */
    public function destroy($id, Request $request): JsonResponse
    {
        try {
            $tableSuffix = $request->input('table');
            
            if ($tableSuffix && $tableSuffix !== 'original') {
                // Delete from specific sharded table
                $date = \Carbon\Carbon::createFromFormat('Ym', $tableSuffix);
                $this->service->deleteReceiptInDate($id, $date->format('Y-m'));
            } else {
                // Delete from any table (original + sharded)
                $this->service->deleteReceipt($id);
            }

            return MessageResponse::success(null, 'Receipt deleted successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }
}

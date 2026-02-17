<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\CashierService;
use App\Http\Requests\StoreCashierRequest;
use App\Http\Requests\UpdateCashierRequest;
use App\Http\Responses\MessageResponse;
use Exception;
use Illuminate\Http\JsonResponse;

class CashierController extends Controller
{
    protected $cashierService;

    public function __construct(CashierService $cashierService)
    {
        $this->cashierService = $cashierService;
    }

    public function index(): JsonResponse
    {
        try {
            $cashiers = $this->cashierService->getAllCashiers();
            return MessageResponse::success($cashiers, 'Cashiers retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function store(StoreCashierRequest $request): JsonResponse
    {
        try {
            $cashier = $this->cashierService->createCashier($request->validated());
            return MessageResponse::success($cashier, 'Cashier created successfully', 201);
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $cashier = $this->cashierService->getCashierById($id);
            if (!$cashier) {
                return MessageResponse::error('Cashier not found', 404);
            }
            return MessageResponse::success($cashier, 'Cashier retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function update(UpdateCashierRequest $request, $id): JsonResponse
    {
        try {
            $cashier = $this->cashierService->updateCashier($id, $request->validated());
            if (!$cashier) {
                return MessageResponse::error('Cashier not found', 404);
            }
            return MessageResponse::success($cashier, 'Cashier updated successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $result = $this->cashierService->deleteCashier($id);
            if (!$result) {
                return MessageResponse::error('Cashier not found', 404);
            }
            return MessageResponse::success(null, 'Cashier deleted successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }
}

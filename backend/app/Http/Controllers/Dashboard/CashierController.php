<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\CashierService;
use App\Http\Requests\StoreCashierRequest;
use App\Http\Requests\UpdateCashierRequest;
use Illuminate\Http\Request;

class CashierController extends Controller
{
    protected $cashierService;

    public function __construct(CashierService $cashierService)
    {
        $this->cashierService = $cashierService;
    }

    public function index()
    {
        return response()->json($this->cashierService->getAllCashiers());
    }

    public function store(StoreCashierRequest $request)
    {
        $cashier = $this->cashierService->createCashier($request->validated());
        return response()->json(['message' => 'Cashier created successfully', 'cashier' => $cashier], 201);
    }

    public function show($id)
    {
        $cashier = $this->cashierService->getCashierById($id);
        if (!$cashier) {
            return response()->json(['message' => 'Cashier not found'], 404);
        }
        return response()->json($cashier);
    }

    public function update(UpdateCashierRequest $request, $id)
    {
        $cashier = $this->cashierService->updateCashier($id, $request->validated());
        if (!$cashier) {
            return response()->json(['message' => 'Cashier not found'], 404);
        }
        return response()->json(['message' => 'Cashier updated successfully', 'cashier' => $cashier]);
    }

    public function destroy($id)
    {
        $result = $this->cashierService->deleteCashier($id);
        if (!$result) {
            return response()->json(['message' => 'Cashier not found'], 404);
        }
        return response()->json(['message' => 'Cashier deleted successfully']);
    }
}

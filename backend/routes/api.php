<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Dashboard\AuthController;
use App\Http\Controllers\Dashboard\CashierController;
use App\Http\Controllers\Dashboard\LocationController;
use App\Http\Controllers\Dashboard\ItemController;
use App\Http\Controllers\Dashboard\CustomerController;
use App\Http\Controllers\Dashboard\FreeItemController;
use App\Http\Controllers\Dashboard\ReceiptController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/cashiers', [CashierController::class, 'index']);
    Route::post('/cashiers', [CashierController::class, 'store']);
    Route::get('/cashiers/{id}', [CashierController::class, 'show']);
    Route::put('/cashiers/{id}', [CashierController::class, 'update']);
    Route::delete('/cashiers/{id}', [CashierController::class, 'destroy']);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('locations', LocationController::class);
    Route::apiResource('items', ItemController::class);
    Route::apiResource('free-items', FreeItemController::class);
    Route::apiResource('receipts', ReceiptController::class)->only(['index', 'show', 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
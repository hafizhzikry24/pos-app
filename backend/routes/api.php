<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Dashboard\CashierController;

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
    Route::post('/logout', [AuthController::class, 'logout']);
});
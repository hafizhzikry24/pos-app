<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Pos\AuthController;
use App\Http\Controllers\Pos\LocationController;
use App\Http\Controllers\Pos\ItemController;
use App\Http\Controllers\Pos\CustomerController;
use App\Http\Controllers\Dashboard\FreeItemController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('locations', LocationController::class);
    Route::apiResource('items', ItemController::class);

    Route::apiResource('customers', CustomerController::class);
    Route::get('/customers/search/{phoneNumber}', [CustomerController::class, 'searchByPhone']);
    Route::post('/free-items/check-eligibility', [FreeItemController::class, 'checkEligibility']);
});
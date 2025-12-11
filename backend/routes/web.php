<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'error' => false,
        'message' => 'Successfully running the API Pos App'
    ]);
});

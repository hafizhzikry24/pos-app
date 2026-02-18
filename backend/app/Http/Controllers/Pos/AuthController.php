<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreCashierRequest;
use App\Http\Requests\UpdateCashierProfileRequest;
use App\Http\Responses\MessageResponse;
use App\Services\PosAuthService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $posAuthService;

    /**
     * @param PosAuthService $posAuthService
     */
    public function __construct(PosAuthService $posAuthService)
    {
        $this->posAuthService = $posAuthService;
    }

    /**
     * @param StoreCashierRequest $request
     * @return JsonResponse
     */
    public function register(StoreCashierRequest $request): JsonResponse
    {
        try {
            $cashier = $this->posAuthService->register($request->validated());
            $token = $cashier->createToken('pos_auth_token')->plainTextToken;
            return MessageResponse::success([
                'cashier' => $cashier,
                'token' => $token
            ], 'Cashier created successfully', 201);
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $token = $this->posAuthService->login($request->validated());
            return MessageResponse::success(['token' => $token], 'Login successful');
        } catch (ValidationException $e) {
            return MessageResponse::validate($e->errors(), $e->getMessage());
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return MessageResponse::success(null, 'Logged out successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function profile(Request $request): JsonResponse
    {
        try {
            return MessageResponse::success($request->user(), 'Profile retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * @param UpdateCashierProfileRequest $request
     * @return JsonResponse
     */
    public function updateProfile(UpdateCashierProfileRequest $request): JsonResponse
    {
        try {
            $cashier = $this->posAuthService->updateProfile($request->user()->id, $request->validated());

            if (!$cashier) {
                return MessageResponse::error('Cashier not found', 404);
            }

            return MessageResponse::success($cashier, 'Profile updated successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }
}

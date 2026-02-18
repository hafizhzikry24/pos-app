<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Responses\MessageResponse;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $authService;

    /**
     * @param AuthService $authService
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function register(StoreUserRequest $request): JsonResponse
    {
        try {
            $user = $this->authService->register($request->validated());
            $token = $user->createToken('auth_token')->plainTextToken;
            return MessageResponse::success([
                'user' => $user,
                'token' => $token
            ], 'User created successfully', 201);
        } catch (Exception $e) {
            return MessageResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $token = $this->authService->login($request->validated());
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
            return MessageResponse::error($e->getMessage(), 500);
        }
    }
}

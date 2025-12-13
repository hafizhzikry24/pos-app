<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Services\PosAuthService;
use App\Http\Requests\StoreCashierRequest;
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(StoreCashierRequest $request)
    {
        $cashier = $this->posAuthService->register($request->validated());
        $token = $cashier->createToken('pos_auth_token')->plainTextToken;
        return response()->json([
            'message' => 'Cashier created successfully', 
            'cashier' => $cashier, 
            'token' => $token
        ], 201);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'token_identifier' => 'required',
        ]);

        try {
            $token = $this->posAuthService->login($credentials);
            return response()->json(['token' => $token]);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:500',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        $cashier = $this->posAuthService->updateProfile($request->user()->id, $data);
        
        if (!$cashier) {
            return response()->json(['message' => 'Cashier not found'], 404);
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'cashier' => $cashier
        ]);
    }
}

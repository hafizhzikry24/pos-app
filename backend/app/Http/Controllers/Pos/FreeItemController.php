<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckEligibilityRequest;
use App\Services\FreeItemService;
use App\Http\Responses\MessageResponse;
use Exception;
use Illuminate\Http\JsonResponse;

class FreeItemController extends Controller
{
    protected $freeItemService;

    /**
     * @param FreeItemService $freeItemService
     */
    public function __construct(FreeItemService $freeItemService)
    {
        $this->freeItemService = $freeItemService;
    }

    /**
     * @param CheckEligibilityRequest $request
     * @return JsonResponse
     */
    public function checkEligibility(CheckEligibilityRequest $request): JsonResponse
    {
        try {
            $purchaseAmount = $request->input('purchase_amount');
            $cartItems = $request->input('cart_items', []);

            $availableFreeItems = $this->freeItemService->checkEligibility($purchaseAmount, $cartItems);

            return MessageResponse::success([
                'eligible_free_items' => $availableFreeItems,
                'purchase_amount' => $purchaseAmount,
            ], 'Eligibility checked successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }
}

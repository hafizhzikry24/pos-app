<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckEligibilityRequest;
use App\Services\FreeItemService;
use App\Http\Requests\StoreFreeItemRequest;
use App\Http\Requests\UpdateFreeItemRequest;
use App\Http\Responses\MessageResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search');
            $perPage = $request->get('per_page', 10);
            
            $freeItems = $this->freeItemService->getPaginatedWithSearch($search, $perPage);
            return MessageResponse::success($freeItems, 'Free items retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * @param StoreFreeItemRequest $request
     * @return JsonResponse
     */
    public function store(StoreFreeItemRequest $request): JsonResponse
    {
        try {
            $freeItem = $this->freeItemService->createFreeItem($request->validated());
            return MessageResponse::success($freeItem, 'Free item created successfully', 201);
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * @param int|string $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $freeItem = $this->freeItemService->getFreeItemById($id);
            if (!$freeItem) {
                return MessageResponse::error('Free item not found', 404);
            }
            return MessageResponse::success($freeItem, 'Free item retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * @param UpdateFreeItemRequest $request
     * @param int|string $id
     * @return JsonResponse
     */
    public function update(UpdateFreeItemRequest $request, $id): JsonResponse
    {
        try {
            $freeItem = $this->freeItemService->updateFreeItem($id, $request->validated());
            if (!$freeItem) {
                return MessageResponse::error('Free item not found', 404);
            }
            return MessageResponse::success($freeItem, 'Free item updated successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    /**
     * @param int|string $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        try {
            $result = $this->freeItemService->deleteFreeItem($id);
            if (!$result) {
                return MessageResponse::error('Free item not found', 404);
            }
            return MessageResponse::success(null, 'Free item deleted successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
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

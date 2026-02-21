<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Responses\MessageResponse;
use App\Services\ItemService;
use Exception;
use Illuminate\Http\JsonResponse;

class ItemController extends Controller
{
    protected $service;

    public function __construct(ItemService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        try {
            $items = $this->service->getAllItems();
            return MessageResponse::success($items, 'Items retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $item = $this->service->getItemById($id);
            return MessageResponse::success($item, 'Item retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::error('Item not found', 404);
        }
    }

    public function store(StoreItemRequest $request): JsonResponse
    {
        try {
            $item = $this->service->createItem($request->validated());
            return MessageResponse::success($item, 'Item created successfully', 201);
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function update(UpdateItemRequest $request, $id): JsonResponse
    {
        try {
            $item = $this->service->updateItem($id, $request->validated());
            return MessageResponse::success($item, 'Item updated successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->service->deleteItem($id);
            return MessageResponse::success(null, 'Item deleted successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }
}

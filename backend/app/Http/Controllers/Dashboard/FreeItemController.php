<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Repositories\FreeItemRepository;
use App\Http\Requests\StoreFreeItemRequest;
use App\Http\Requests\UpdateFreeItemRequest;
use Illuminate\Http\Request;

class FreeItemController extends Controller
{
    protected $freeItemRepository;

    public function __construct(FreeItemRepository $freeItemRepository)
    {
        $this->freeItemRepository = $freeItemRepository;
    }

    public function index()
    {
        return response()->json($this->freeItemRepository->getAll());
    }

    public function store(StoreFreeItemRequest $request)
    {
        $data = $request->validated();
        $freeItem = $this->freeItemRepository->create($data);
        
        if (isset($data['eligible_items'])) {
            $this->freeItemRepository->syncEligibleItems($freeItem->id, $data['eligible_items']);
        }
        
        if (isset($data['selectable_items'])) {
            $this->freeItemRepository->syncSelectableItems($freeItem->id, $data['selectable_items']);
        }

        $freeItem = $this->freeItemRepository->findById($freeItem->id);
        
        return response()->json(['message' => 'Free item created successfully', 'free_item' => $freeItem], 201);
    }

    public function show($id)
    {
        $freeItem = $this->freeItemRepository->findById($id);
        if (!$freeItem) {
            return response()->json(['message' => 'Free item not found'], 404);
        }
        return response()->json($freeItem);
    }

    public function update(UpdateFreeItemRequest $request, $id)
    {
        $data = $request->validated();
        $freeItem = $this->freeItemRepository->update($id, $data);
        
        if (!$freeItem) {
            return response()->json(['message' => 'Free item not found'], 404);
        }

        if (isset($data['eligible_items'])) {
            $this->freeItemRepository->syncEligibleItems($id, $data['eligible_items']);
        }
        
        if (isset($data['selectable_items'])) {
            $this->freeItemRepository->syncSelectableItems($id, $data['selectable_items']);
        }

        $freeItem = $this->freeItemRepository->findById($id);
        
        return response()->json(['message' => 'Free item updated successfully', 'free_item' => $freeItem]);
    }

    public function destroy($id)
    {
        $result = $this->freeItemRepository->delete($id);
        if (!$result) {
            return response()->json(['message' => 'Free item not found'], 404);
        }
        return response()->json(['message' => 'Free item deleted successfully']);
    }

    public function checkEligibility(Request $request)
    {
        $request->validate([
            'purchase_amount' => 'required|numeric|min:0',
            'cart_items' => 'sometimes|array',
            'cart_items.*.item_id' => 'required|integer|exists:items,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
        ]);

        $purchaseAmount = $request->input('purchase_amount');
        $eligibleFreeItems = $this->freeItemRepository->getEligibleFreeItems($purchaseAmount);

        $cartItemIds = [];
        if ($request->has('cart_items')) {
            $cartItemIds = array_column($request->input('cart_items'), 'item_id');
        }

        $availableFreeItems = [];
        foreach ($eligibleFreeItems as $freeItem) {
            $eligibleItemIds = $freeItem->eligibleItems->pluck('id')->toArray();
            
            if (empty($eligibleItemIds) || count(array_intersect($cartItemIds, $eligibleItemIds)) > 0) {
                $availableFreeItems[] = $freeItem;
            }
        }

        return response()->json([
            'eligible_free_items' => $availableFreeItems,
            'purchase_amount' => $purchaseAmount,
        ]);
    }
}

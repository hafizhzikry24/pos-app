<?php

namespace App\Repositories;

use App\Interfaces\FreeItemRepositoryInterface;
use App\Models\FreeItem;

class FreeItemRepository implements FreeItemRepositoryInterface
{
    /**
     * @param array $data
     * @return \App\Models\FreeItem
     */
    public function create(array $data)
    {
        return FreeItem::create($data);
    }

    /**
     * @param int $id
     * @return \App\Models\FreeItem|null
     */
    public function findById(int $id)
    {
        return FreeItem::with(['eligibleItems', 'selectableItems'])->find($id);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll()
    {
        return FreeItem::with(['eligibleItems', 'selectableItems'])->get();
    }

    /**
     * @param int $id
     * @return bool
     */
    public function delete($id)
    {
        return FreeItem::destroy($id);
    }

    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\FreeItem
     */
    public function update(int $id, array $data)
    {
        $freeItem = FreeItem::find($id);
        if ($freeItem) {
            $freeItem->update($data);
            return $freeItem;
        }
        return null;
    }

    /**
     * @param int $freeItemId
     * @param array $itemIds
     * @return void
     */
    public function syncEligibleItems(int $freeItemId, array $itemIds)
    {
        $freeItem = FreeItem::find($freeItemId);
        if ($freeItem) {
            $freeItem->eligibleItems()->sync($itemIds);
        }
    }

    /**
     * @param int $freeItemId
     * @param array $itemIds
     * @return void
     */
    public function syncSelectableItems(int $freeItemId, array $itemIds)
    {
        $freeItem = FreeItem::find($freeItemId);
        if ($freeItem) {
            $freeItem->selectableItems()->sync($itemIds);
        }
    }

    /**
     * @param float $purchaseAmount
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getEligibleFreeItems(float $purchaseAmount)
    {
        return FreeItem::where('is_active', true)
            ->where('required_purchase_amount', '<=', $purchaseAmount)
            ->with(['eligibleItems', 'selectableItems'])
            ->get();
    }
}

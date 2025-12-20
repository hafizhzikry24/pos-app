<?php

namespace App\Interfaces;

interface FreeItemRepositoryInterface
{
    /**
     * @param array $data
     * @return \App\Models\FreeItem
     */
    public function create(array $data);
    
    /**
     * @param int $id
     * @return \App\Models\FreeItem|null
     */
    public function findById(int $id);
    
    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll();
    
    /**
     * @param int $id
     * @return bool
     */
    public function delete($id);
    
    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\FreeItem
     */
    public function update(int $id, array $data);

    /**
     * @param int $freeItemId
     * @param array $itemIds
     * @return void
     */
    public function syncEligibleItems(int $freeItemId, array $itemIds);

    /**
     * @param int $freeItemId
     * @param array $itemIds
     * @return void
     */
    public function syncSelectableItems(int $freeItemId, array $itemIds);

    /**
     * @param float $purchaseAmount
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getEligibleFreeItems(float $purchaseAmount);
}

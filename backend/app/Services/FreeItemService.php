<?php

namespace App\Services;

use App\Interfaces\FreeItemRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Exception;

class FreeItemService
{
    protected $repository;

    /**
     * @param FreeItemRepositoryInterface $repository
     */
    public function __construct(FreeItemRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllFreeItems()
    {
        return $this->repository->getAll();
    }

    /**
     * Get paginated free items with search functionality
     * 
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedWithSearch(?string $search = null, int $perPage = 10)
    {
        return $this->repository->getPaginatedWithSearch($search, $perPage);
    }

    /**
     * @param int $id
     * @return \App\Models\FreeItem|null
     */
    public function getFreeItemById(int $id)
    {
        return $this->repository->findById($id);
    }

    /**
     * @param array $data
     * @return \App\Models\FreeItem
     * @throws Exception
     */
    public function createFreeItem(array $data)
    {
        return \DB::transaction(function () use ($data) {
            $freeItem = $this->repository->create($data);

            if (isset($data['eligible_items'])) {
                $this->repository->syncEligibleItems($freeItem->id, $data['eligible_items']);
            }

            if (isset($data['selectable_items'])) {
                $this->repository->syncSelectableItems($freeItem->id, $data['selectable_items']);
            }

            return $this->repository->findById($freeItem->id);
        });
    }

    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\FreeItem|null
     * @throws Exception
     */
    public function updateFreeItem(int $id, array $data)
    {
        return \DB::transaction(function () use ($id, $data) {
            $freeItem = $this->repository->update($id, $data);

            if (!$freeItem) {
                return null;
            }

            if (isset($data['eligible_items'])) {
                $this->repository->syncEligibleItems($id, $data['eligible_items']);
            }

            if (isset($data['selectable_items'])) {
                $this->repository->syncSelectableItems($id, $data['selectable_items']);
            }

            return $this->repository->findById($id);
        });
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deleteFreeItem(int $id)
    {
        return $this->repository->delete($id);
    }

    /**
     * @param float $purchaseAmount
     * @param array $cartItems
     * @return array
     */
    public function checkEligibility(float $purchaseAmount, array $cartItems = [])
    {
        $eligibleFreeItems = $this->repository->getEligibleFreeItems($purchaseAmount);

        $cartItemIds = array_column($cartItems, 'item_id');

        $availableFreeItems = [];
        foreach ($eligibleFreeItems as $freeItem) {
            $eligibleItemIds = $freeItem->eligibleItems->pluck('id')->toArray();

            // If no specific eligible items are required, or at least one cart item matches
            if (empty($eligibleItemIds) || count(array_intersect($cartItemIds, $eligibleItemIds)) > 0) {
                $availableFreeItems[] = $freeItem;
            }
        }

        return $availableFreeItems;
    }
}

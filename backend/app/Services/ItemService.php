<?php

namespace App\Services;

use App\Interfaces\ItemRepositoryInterface;

class ItemService
{
    protected $repository;

    public function __construct(ItemRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllItems()
    {
        return $this->repository->getAll();
    }

    /**
     * Get paginated items with search functionality
     * 
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedWithSearch(?string $search = null, int $perPage = 10)
    {
        return $this->repository->getPaginatedWithSearch($search, $perPage);
    }

    public function getItemById($id)
    {
        return $this->repository->getById($id);
    }

    public function createItem(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateItem($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteItem($id)
    {
        return $this->repository->delete($id);
    }
}

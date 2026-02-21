<?php

namespace App\Interfaces;

interface LocationRepositoryInterface
{
    public function getAll();
    
    /**
     * Get paginated locations with search functionality
     * 
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedWithSearch(?string $search = null, int $perPage = 10);
    public function getById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}

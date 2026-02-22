<?php

namespace App\Interfaces;

interface CustomerRepositoryInterface
{
    /**
     * @param array $data
     * @return \App\Models\Customer
     */
    public function create(array $data);
    
    /**
     * @param string $phoneNumber
     * @return \App\Models\Customer|null
     */
    public function findByPhoneNumber(string $phoneNumber);
    
    /**
     * @param int $id
     * @return \App\Models\Customer|null
     */
    public function findById(int $id);
    
    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll();
    
    /**
     * Get paginated customers with search functionality
     * 
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedWithSearch(?string $search = null, int $perPage = 10);
    
    /**
     * @param int $id
     * @return bool
     */
    public function delete($id);
    
    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\Customer
     */
    public function update(int $id, array $data);
}

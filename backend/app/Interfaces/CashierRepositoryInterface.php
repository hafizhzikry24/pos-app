<?php

namespace App\Interfaces;

interface CashierRepositoryInterface
{
    /**
     * @param array $data
     * @return \App\Models\Cashier
     */
    public function create(array $data);
    
    /**
     * @param string $email
     * @return \App\Models\Cashier|null
     */
    public function findByEmail(string $email);
    
    /**
     * @param int $id
     * @return \App\Models\Cashier|null
     */
    public function findById(int $id);
    
    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll();
    
    /**
     * @param int $storeId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByStoreId(int $storeId);
    
    /**
     * @param int $id
     * @return bool
     */
    public function delete($id);
    
    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\Cashier
     */
    public function update(int $id, array $data);
}

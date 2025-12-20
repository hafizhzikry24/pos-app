<?php

namespace App\Interfaces;

interface UserRepositoryInterface
{
    /**
     * @param array $data
     * @return \App\Models\User
     */
    public function create(array $data);
    
    /**
     * @param string $email
     * @return \App\Models\User
     */
    public function findByEmail(string $email);
    
    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCashiers();
    
    /**
     * @param int $id
     * @return bool
     */
    public function delete($id);
}

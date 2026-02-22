<?php

namespace App\Repositories;

use App\Interfaces\CashierRepositoryInterface;
use App\Models\Cashier;

class CashierRepository implements CashierRepositoryInterface
{
    /**
     * @param array $data
     * @return \App\Models\Cashier
     */
    public function create(array $data)
    {
        return Cashier::create($data);
    }

    /**
     * @param string $email
     * @return \App\Models\Cashier|null
     */
    public function findByEmail(string $email)
    {
        return Cashier::where('email', $email)->first();
    }

    /**
     * @param int $id
     * @return \App\Models\Cashier|null
     */
    public function findById(int $id)
    {
        return Cashier::find($id);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll()
    {
        return Cashier::all();
    }

    /**
     * Get paginated cashiers with search functionality
     * 
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedWithSearch(?string $search = null, int $perPage = 10)
    {
        $query = Cashier::query();
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }
        
        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * @param int $storeId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByStoreId(int $storeId)
    {
        return Cashier::where('store_id', $storeId)->get();
    }

    /**
     * @param int $id
     * @return bool
     */
    public function delete($id)
    {
        return Cashier::destroy($id);
    }

    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\Cashier
     */
    public function update(int $id, array $data)
    {
        $cashier = Cashier::find($id);
        if ($cashier) {
            $cashier->update($data);
            return $cashier;
        }
        return null;
    }
}

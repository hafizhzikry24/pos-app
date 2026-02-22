<?php

namespace App\Repositories;

use App\Interfaces\CustomerRepositoryInterface;
use App\Models\Customer;

class CustomerRepository implements CustomerRepositoryInterface
{
    /**
     * @param array $data
     * @return \App\Models\Customer
     */
    public function create(array $data)
    {
        return Customer::create($data);
    }

    /**
     * @param string $phoneNumber
     * @return \App\Models\Customer|null
     */
    public function findByPhoneNumber(string $phoneNumber)
    {
        return Customer::where('phone_number', $phoneNumber)->first();
    }

    /**
     * @param int $id
     * @return \App\Models\Customer|null
     */
    public function findById(int $id)
    {
        return Customer::find($id);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll()
    {
        return Customer::all();
    }

    /**
     * Get paginated customers with search functionality
     * 
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedWithSearch(?string $search = null, int $perPage = 10)
    {
        $query = Customer::query();
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('phone_number', 'LIKE', "%{$search}%");
            });
        }
        
        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * @param int $id
     * @return bool
     */
    public function delete($id)
    {
        return Customer::destroy($id);
    }

    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\Customer
     */
    public function update(int $id, array $data)
    {
        $customer = Customer::find($id);
        if ($customer) {
            $customer->update($data);
            return $customer;
        }
        return null;
    }
}

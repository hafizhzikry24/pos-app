<?php

namespace App\Services;

use App\Interfaces\CashierRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use App\Models\Cashier;

class CashierService
{
    private CashierRepositoryInterface $cashierRepository;

    /**
     * @param CashierRepositoryInterface $cashierRepository
     */
    public function __construct(CashierRepositoryInterface $cashierRepository)
    {
        $this->cashierRepository = $cashierRepository;
    }

    /**
     * @param array $data
     * @return \App\Models\Cashier
     */
    public function createCashier(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        return $this->cashierRepository->create($data);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCashiers()
    {
        return $this->cashierRepository->getAll();
    }

    /**
     * @param int $id
     * @return \App\Models\Cashier|null
     */
    public function getCashierById($id)
    {
        return $this->cashierRepository->findById($id);
    }

    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\Cashier|null
     */
    public function updateCashier($id, array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $this->cashierRepository->update($id, $data);
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deleteCashier($id)
    {
        return $this->cashierRepository->delete($id);
    }
}

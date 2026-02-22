<?php

namespace App\Interfaces;

/**
 * Interface ReceiptRepositoryInterface
 * @package App\Interfaces
 */
interface ReceiptRepositoryInterface
{
    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll();

    /**
     * Get paginated receipts with search functionality
     * 
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedWithSearch(?string $search = null, int $perPage = 10);

    /**
     * @param int $id
     * @return \App\Models\Receipt
     */
    public function getById($id);

    /**
     * @param array $data
     * @return \App\Models\Receipt
     */
    public function create(array $data);

    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\Receipt
     */
    public function update($id, array $data);

    /**
     * @param int $id
     * @return bool
     */
    public function delete($id);

    /**
     * @param string $number
     * @return \App\Models\Receipt
     */
    public function getByNumber($number);
}

<?php

namespace App\Repositories;

use App\Interfaces\ReceiptRepositoryInterface;
use App\Services\ReceiptShardingService;

class ReceiptRepository implements ReceiptRepositoryInterface
{
    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll()
    {
        return ReceiptShardingService::getAllReceiptsFromAllTables();
    }

    /**
     * Get paginated receipts with search functionality
     * 
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedWithSearch(?string $search = null, int $perPage = 10)
    {
        return ReceiptShardingService::getPaginatedReceiptsWithSearch($search, $perPage);
    }

    /**
     * @param int $id
     * @return \App\Models\Receipt
     */
    public function getById($id)
    {
        $receipt = ReceiptShardingService::findReceiptInAllTables($id);
        
        if (!$receipt) {
            throw new \Exception("Receipt not found");
        }
        
        return $receipt;
    }

    /**
     * @param array $data
     * @return \App\Models\Receipt
     */
    public function create(array $data)
    {
        return ReceiptShardingService::createReceipt($data);
    }

    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\Receipt
     */
    public function update($id, array $data)
    {
        $receipt = ReceiptShardingService::findReceiptInAllTables($id);
        
        if (!$receipt) {
            throw new \Exception("Receipt not found");
        }
        
        $receipt->update($data);
        return $receipt;
    }

    /**
     * @param int $id
     * @return bool
     */
    public function delete($id)
    {
        return ReceiptShardingService::deleteReceiptInAllTables($id);
    }

    /**
     * @param string $number
     * @return \App\Models\Receipt
     */
    public function getByNumber($number)
    {
        $receipt = ReceiptShardingService::findReceiptByNumberInAllTables($number);
        
        if (!$receipt) {
            throw new \Exception("Receipt with number '{$number}' not found");
        }
        
        return $receipt;
    }
}

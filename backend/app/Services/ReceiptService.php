<?php

namespace App\Services;

use App\Interfaces\ReceiptRepositoryInterface;
use App\Services\ReceiptShardingService;
use Illuminate\Support\Facades\DB;
use Exception;

class ReceiptService
{
    protected $repository;

    /**
     * ReceiptService constructor.
     * @param ReceiptRepositoryInterface $repository
     */
    public function __construct(ReceiptRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllReceipts()
    {
        return $this->repository->getAll();
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
        return $this->repository->getPaginatedWithSearch($search, $perPage);
    }

    /**
     * @param int $id
     * @return \App\Models\Receipt
     */
    public function getReceiptById($id)
    {
        return $this->repository->getById($id);
    }

    /**
     * Get receipt by ID from a specific month's table.
     * 
     * @param int $id
     * @param string $date
     * @return \App\Models\Receipt
     */
    public function getReceiptByIdAndDate($id, $date)
    {
        return ReceiptShardingService::findReceipt($id, $date);
    }

    /**
     * @param string $number
     * @return \App\Models\Receipt
     */
    public function getReceiptByNumber($number)
    {
        return $this->repository->getByNumber($number);
    }

    /**
     * Create a new transaction (Receipt and Items)
     * 
     * @param array $receiptData
     * @param array $items
     * @return \App\Models\Receipt
     * @throws Exception
     */
    public function createTransaction(array $receiptData, array $items)
    {
        return DB::transaction(function () use ($receiptData, $items) {
            // Create receipt using sharding service
            $receipt = ReceiptShardingService::createReceipt($receiptData);

            // Create receipt items using sharding service
            $receiptItemsModel = ReceiptShardingService::createReceiptItemModel();
            
            foreach ($items as $item) {
                $receiptItemsModel->create([
                    'receipt_id' => $receipt->id,
                    'item_id' => $item['item_id'],
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'discount' => $item['discount'] ?? 0,
                    'total' => $item['total'],
                    'is_free_item' => $item['is_free_item'] ?? false,
                ]);
            }

            // Load receipt items from the sharded table
            $receipt->setRelation('receiptItems', 
                ReceiptShardingService::getReceiptItemsQuery()
                    ->where('receipt_id', $receipt->id)
                    ->get()
            );

            return $receipt;
        });
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deleteReceipt($id)
    {
        return $this->repository->delete($id);
    }

    /**
     * Delete receipt from a specific month's table.
     * 
     * @param int $id
     * @param string $date
     * @return bool
     */
    public function deleteReceiptInDate($id, $date)
    {
        $receipt = ReceiptShardingService::findReceipt($id, $date);
        
        if (!$receipt) {
            throw new \Exception("Receipt not found in " . $date . " table");
        }
        
        // Get receipt items from the same sharded table
        $receiptItems = ReceiptShardingService::findReceiptItems($receipt->id, $date);
        
        // Soft delete all receipt items first
        foreach ($receiptItems as $item) {
            $item->delete();
        }
        
        // Then soft delete the receipt
        return $receipt->delete();
    }
}

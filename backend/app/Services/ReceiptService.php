<?php

namespace App\Services;

use App\Interfaces\ReceiptRepositoryInterface;
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
     * @param int $id
     * @return \App\Models\Receipt
     */
    public function getReceiptById($id)
    {
        return $this->repository->getById($id);
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
            $receipt = $this->repository->create($receiptData);

            foreach ($items as $item) {
                $receipt->receiptItems()->create([
                    'item_id' => $item['item_id'],
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'discount' => $item['discount'] ?? 0,
                    'total' => $item['total'],
                ]);
            }

            return $receipt->load('receiptItems');
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
}

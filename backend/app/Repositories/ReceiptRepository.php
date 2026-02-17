<?php

namespace App\Repositories;

use App\Interfaces\ReceiptRepositoryInterface;
use App\Models\Receipt;

class ReceiptRepository implements ReceiptRepositoryInterface
{
    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll()
    {
        return Receipt::with(['receiptItems', 'location', 'cashier', 'customer'])->get();
    }

    /**
     * @param int $id
     * @return \App\Models\Receipt
     */
    public function getById($id)
    {
        return Receipt::with(['receiptItems', 'location', 'cashier', 'customer'])->findOrFail($id);
    }

    /**
     * @param array $data
     * @return \App\Models\Receipt
     */
    public function create(array $data)
    {
        return Receipt::create($data);
    }

    /**
     * @param int $id
     * @param array $data
     * @return \App\Models\Receipt
     */
    public function update($id, array $data)
    {
        $receipt = Receipt::findOrFail($id);
        $receipt->update($data);
        return $receipt;
    }

    /**
     * @param int $id
     * @return bool
     */
    public function delete($id)
    {
        $receipt = Receipt::findOrFail($id);
        return $receipt->delete();
    }

    /**
     * @param string $number
     * @return \App\Models\Receipt
     */
    public function getByNumber($number)
    {
        return Receipt::with(['receiptItems', 'location', 'cashier', 'customer'])
            ->where('number', $number)
            ->firstOrFail();
    }
}

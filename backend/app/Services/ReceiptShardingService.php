<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Model;

class ReceiptShardingService
{
    /**
     * Get table suffix for a given date.
     *
     * @param string|Carbon|null $date
     * @return string
     */
    public static function getTableSuffix($date = null): string
    {
        $date = $date ? Carbon::parse($date) : now();
        return $date->format('Ym');
    }

    /**
     * Get receipts table name for a given date.
     *
     * @param string|Carbon|null $date
     * @return string
     */
    public static function getReceiptsTableName($date = null): string
    {
        return 'receipts_' . self::getTableSuffix($date);
    }

    /**
     * Get receipt items table name for a given date.
     *
     * @param string|Carbon|null $date
     * @return string
     */
    public static function getReceiptItemsTableName($date = null): string
    {
        return 'receipt_items_' . self::getTableSuffix($date);
    }

    /**
     * Check if receipts table exists for a given date.
     *
     * @param string|Carbon|null $date
     * @return bool
     */
    public static function receiptsTableExists($date = null): bool
    {
        return Schema::hasTable(self::getReceiptsTableName($date));
    }

    /**
     * Check if receipt items table exists for a given date.
     *
     * @param string|Carbon|null $date
     * @return bool
     */
    public static function receiptItemsTableExists($date = null): bool
    {
        return Schema::hasTable(self::getReceiptItemsTableName($date));
    }

    /**
     * Check if both sharded tables exist for a given date.
     *
     * @param string|Carbon|null $date
     * @return bool
     */
    public static function tablesExist($date = null): bool
    {
        return self::receiptsTableExists($date) && self::receiptItemsTableExists($date);
    }

    /**
     * Create a new Receipt model instance for a specific date.
     *
     * @param string|Carbon|null $date
     * @return \Illuminate\Database\Eloquent\Model
     */
    public static function createReceiptModel($date = null): Model
    {
        $tableName = self::getReceiptsTableName($date);
        
        if (!self::receiptsTableExists($date)) {
            throw new \Exception("Receipts table '{$tableName}' does not exist for date: " . 
                ($date ? Carbon::parse($date)->format('Y-m') : 'current month'));
        }
        
        $model = new \App\Models\Receipt();
        $model->setTable($tableName);
        
        return $model;
    }

    /**
     * Create a new ReceiptItem model instance for a specific date.
     *
     * @param string|Carbon|null $date
     * @return \Illuminate\Database\Eloquent\Model
     */
    public static function createReceiptItemModel($date = null): Model
    {
        $tableName = self::getReceiptItemsTableName($date);
        
        if (!self::receiptItemsTableExists($date)) {
            throw new \Exception("Receipt items table '{$tableName}' does not exist for date: " . 
                ($date ? Carbon::parse($date)->format('Y-m') : 'current month'));
        }
        
        $model = new \App\Models\ReceiptItem();
        $model->setTable($tableName);
        
        return $model;
    }

    /**
     * Get receipts query for a specific date.
     *
     * @param string|Carbon|null $date
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function getReceiptsQuery($date = null)
    {
        return self::createReceiptModel($date)->newQuery();
    }

    /**
     * Get receipt items query for a specific date.
     *
     * @param string|Carbon|null $date
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function getReceiptItemsQuery($date = null)
    {
        return self::createReceiptItemModel($date)->newQuery();
    }

    /**
     * Find receipt items by receipt ID for a specific date.
     *
     * @param int $receiptId
     * @param string|Carbon|null $date
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function findReceiptItems(int $receiptId, $date = null)
    {
        return self::getReceiptItemsQuery($date)->where('receipt_id', $receiptId)->get();
    }

    /**
     * Find a receipt by ID for a specific date.
     *
     * @param int $id
     * @param string|Carbon|null $date
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public static function findReceipt(int $id, $date = null)
    {
        $receipt = self::getReceiptsQuery($date)
            ->find($id);
        
        if ($receipt) {
            // Manually load receipt items from the same sharded table
            $receiptItems = self::getReceiptItemsQuery($date)
                ->where('receipt_id', $receipt->id)
                ->get();
            
            $receipt->setRelation('receiptItems', $receiptItems);
            
            // Load other relationships normally
            $receipt->load(['location', 'cashier', 'customer']);
            
            // Add table info to the receipt
            $receipt->table_info = [
                'date' => $date ? Carbon::parse($date)->format('Y-m') : Carbon::now()->format('Y-m'),
                'suffix' => self::getTableSuffix($date),
                'receipts_table' => self::getReceiptsTableName($date),
                'receipt_items_table' => self::getReceiptItemsTableName($date),
            ];
        }
        
        return $receipt;
    }

    /**
     * Get all available table suffixes (months) that have been created.
     *
     * @param int $limit
     * @return array
     */
    public static function getAvailableTableSuffixes(int $limit = 24): array
    {
        $suffixes = [];
        
        // Check last N months
        for ($i = 0; $i < $limit; $i++) {
            $date = now()->subMonths($i);
            if (self::tablesExist($date)) {
                $suffixes[] = self::getTableSuffix($date);
            }
        }
        
        return $suffixes;
    }

    /**
     * Get all receipts from both original table and all available sharded tables.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getAllReceiptsFromAllTables()
    {
        $allReceipts = collect();
        
        // First, get receipts from the original table
        try {
            $originalReceipts = \App\Models\Receipt::with(['receiptItems', 'location', 'cashier', 'customer'])
                ->get();
            
            // Add table info to each receipt from original table
            $originalReceipts->each(function ($receipt) {
                $receipt->table_info = [
                    'date' => 'original',
                    'suffix' => 'original',
                    'receipts_table' => 'receipts',
                    'receipt_items_table' => 'receipt_items',
                ];
            });
            
            $allReceipts = $allReceipts->concat($originalReceipts);
        } catch (\Exception $e) {
            // Skip if original table has issues
        }
        
        // Then, get receipts from sharded tables
        $suffixes = self::getAvailableTableSuffixes(24); // Last 24 months
        
        foreach ($suffixes as $suffix) {
            try {
                $date = Carbon::createFromFormat('Ym', $suffix);
                $receipts = self::getReceiptsQuery($date)
                    ->with(['receiptItems', 'location', 'cashier', 'customer'])
                    ->get();
                
                // Add table info to each receipt from sharded table
                $receipts->each(function ($receipt) use ($date, $suffix) {
                    $receipt->table_info = [
                        'date' => $date->format('Y-m'),
                        'suffix' => $suffix,
                        'receipts_table' => self::getReceiptsTableName($date),
                        'receipt_items_table' => self::getReceiptItemsTableName($date),
                    ];
                });
                
                $allReceipts = $allReceipts->concat($receipts);
            } catch (\Exception $e) {
                // Skip tables that might have issues
                continue;
            }
        }
        
        // Sort by created_at descending
        return $allReceipts->sortByDesc('created_at')->values();
    }

    /**
     * Get paginated receipts with search functionality from all tables.
     *
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public static function getPaginatedReceiptsWithSearch(?string $search = null, int $perPage = 10)
    {
        $allReceipts = collect();
        
        // First, get receipts from the original table
        try {
            $query = \App\Models\Receipt::with(['receiptItems', 'location', 'cashier', 'customer']);
            
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('number', 'LIKE', "%{$search}%")
                      ->orWhereHas('cashier', function($subQ) use ($search) {
                          $subQ->where('name', 'LIKE', "%{$search}%");
                      })
                      ->orWhereHas('customer', function($subQ) use ($search) {
                          $subQ->where('name', 'LIKE', "%{$search}%");
                      });
                });
            }
            
            $originalReceipts = $query->get();
            
            // Add table info to each receipt from original table
            $originalReceipts->each(function ($receipt) {
                $receipt->table_info = [
                    'date' => 'original',
                    'suffix' => 'original',
                    'receipts_table' => 'receipts',
                    'receipt_items_table' => 'receipt_items',
                ];
            });
            
            $allReceipts = $allReceipts->concat($originalReceipts);
        } catch (\Exception $e) {
            // Skip if original table has issues
        }
        
        // Then, get receipts from sharded tables
        $suffixes = self::getAvailableTableSuffixes(24); // Last 24 months
        
        foreach ($suffixes as $suffix) {
            try {
                $date = Carbon::createFromFormat('Ym', $suffix);
                $query = self::getReceiptsQuery($date)
                    ->with(['receiptItems', 'location', 'cashier', 'customer']);
                
                if ($search) {
                    $query->where(function($q) use ($search) {
                        $q->where('number', 'LIKE', "%{$search}%")
                          ->orWhereHas('cashier', function($subQ) use ($search) {
                              $subQ->where('name', 'LIKE', "%{$search}%");
                          })
                          ->orWhereHas('customer', function($subQ) use ($search) {
                              $subQ->where('name', 'LIKE', "%{$search}%");
                          });
                    });
                }
                
                $receipts = $query->get();
                
                // Add table info to each receipt from sharded table
                $receipts->each(function ($receipt) use ($date, $suffix) {
                    $receipt->table_info = [
                        'date' => $date->format('Y-m'),
                        'suffix' => $suffix,
                        'receipts_table' => self::getReceiptsTableName($date),
                        'receipt_items_table' => self::getReceiptItemsTableName($date),
                    ];
                });
                
                $allReceipts = $allReceipts->concat($receipts);
            } catch (\Exception $e) {
                // Skip tables that might have issues
                continue;
            }
        }
        
        // Sort by created_at descending and paginate
        $sortedReceipts = $allReceipts->sortByDesc('created_at')->values();
        
        // Manual pagination since we're dealing with a collection
        $currentPage = request()->get('page', 1);
        $offset = ($currentPage - 1) * $perPage;
        $itemsForCurrentPage = $sortedReceipts->slice($offset, $perPage)->values();
        $total = $sortedReceipts->count();
        $lastPage = ceil($total / $perPage);
        
        return new \Illuminate\Pagination\LengthAwarePaginator(
            $itemsForCurrentPage,
            $total,
            $perPage,
            $currentPage,
            [
                'path' => request()->url(),
                'pageName' => 'page',
            ]
        );
    }

    /**
     * Find receipt by ID in both original table and all available sharded tables.
     *
     * @param int $id
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public static function findReceiptInAllTables(int $id)
    {
        // First, check the original table
        try {
            $receipt = \App\Models\Receipt::find($id);
            
            if ($receipt) {
                // Load receipt items from original table
                $receipt->setRelation('receiptItems', $receipt->receiptItems);
                
                // Load other relationships
                $receipt->load(['location', 'cashier', 'customer']);
                
                $receipt->table_info = [
                    'date' => 'original',
                    'suffix' => 'original',
                    'receipts_table' => 'receipts',
                    'receipt_items_table' => 'receipt_items',
                ];
                return $receipt;
            }
        } catch (\Exception $e) {
            // Skip if original table has issues
        }
        
        // Then, check sharded tables
        $suffixes = self::getAvailableTableSuffixes(24); // Last 24 months
        
        foreach ($suffixes as $suffix) {
            try {
                $date = Carbon::createFromFormat('Ym', $suffix);
                $receipt = self::findReceipt($id, $date);
                
                if ($receipt) {
                    return $receipt;
                }
            } catch (\Exception $e) {
                // Skip tables that might have issues
                continue;
            }
        }
        
        return null;
    }

    /**
     * Find receipt by number in both original table and all available sharded tables.
     *
     * @param string $number
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public static function findReceiptByNumberInAllTables(string $number)
    {
        // First, check the original table
        try {
            $receipt = \App\Models\Receipt::with(['receiptItems', 'location', 'cashier', 'customer'])
                ->where('number', $number)
                ->first();
            
            if ($receipt) {
                $receipt->table_info = [
                    'date' => 'original',
                    'suffix' => 'original',
                    'receipts_table' => 'receipts',
                    'receipt_items_table' => 'receipt_items',
                ];
                return $receipt;
            }
        } catch (\Exception $e) {
            // Skip if original table has issues
        }
        
        // Then, check sharded tables
        $suffixes = self::getAvailableTableSuffixes(24); // Last 24 months
        
        foreach ($suffixes as $suffix) {
            try {
                $date = Carbon::createFromFormat('Ym', $suffix);
                $receipt = self::getReceiptsQuery($date)
                    ->with(['receiptItems', 'location', 'cashier', 'customer'])
                    ->where('number', $number)
                    ->first();
                
                if ($receipt) {
                    $receipt->table_info = [
                        'date' => $date->format('Y-m'),
                        'suffix' => $suffix,
                        'receipts_table' => self::getReceiptsTableName($date),
                        'receipt_items_table' => self::getReceiptItemsTableName($date),
                    ];
                    return $receipt;
                }
            } catch (\Exception $e) {
                // Skip tables that might have issues
                continue;
            }
        }
        
        return null;
    }

    /**
     * Create receipt in current month's table.
     *
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     */
    public static function createReceipt(array $data)
    {
        $receiptModel = self::createReceiptModel();
        return $receiptModel->create($data);
    }

    /**
     * Delete receipt by ID from both original table and all available sharded tables.
     *
     * @param int $id
     * @return bool
     */
    public static function deleteReceiptInAllTables(int $id)
    {
        // First, check and delete from the original table
        try {
            $receipt = \App\Models\Receipt::find($id);
            
            if ($receipt) {
                return $receipt->delete();
            }
        } catch (\Exception $e) {
            // Skip if original table has issues
        }
        
        // Then, check and delete from sharded tables
        $suffixes = self::getAvailableTableSuffixes(24); // Last 24 months
        
        foreach ($suffixes as $suffix) {
            try {
                $date = Carbon::createFromFormat('Ym', $suffix);
                $receipt = self::getReceiptsQuery($date)->find($id);
                
                if ($receipt) {
                    return $receipt->delete();
                }
            } catch (\Exception $e) {
                // Skip tables that might have issues
                continue;
            }
        }
        
        return false;
    }
}

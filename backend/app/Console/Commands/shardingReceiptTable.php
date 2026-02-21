<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

class shardingReceiptTable extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sharding-receipt-table {--date= : Create tables for specific date (Y-m format)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create monthly sharded tables for receipts and receipt_items';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = $this->option('date') ?? now()->format('Y-m');
        
        if (!$this->isValidDate($date)) {
            $this->error('Invalid date format. Use Y-m format (e.g., 2026-02)');
            return 1;
        }

        $this->info("Creating sharded tables for date: {$date}");
        
        try {
            $receiptsTable = "receipts_" . str_replace('-', '', $date);
            $receiptItemsTable = "receipt_items_" . str_replace('-', '', $date);
            
            $this->createReceiptsTable($receiptsTable);
            $this->createReceiptItemsTable($receiptItemsTable);
            
            $this->info("Successfully created tables: {$receiptsTable}, {$receiptItemsTable}");
            
            Log::info("Sharded tables created", [
                'date' => $date,
                'receipts_table' => $receiptsTable,
                'receipt_items_table' => $receiptItemsTable
            ]);
            
            return 0;
        } catch (\Exception $e) {
            $this->error("Failed to create sharded tables: " . $e->getMessage());
            Log::error("Failed to create sharded tables", [
                'date' => $date,
                'error' => $e->getMessage()
            ]);
            return 1;
        }
    }

    /**
     * Create receipts table for the given date.
     */
    private function createReceiptsTable(string $tableName): void
    {
        if (Schema::hasTable($tableName)) {
            $this->warn("Table {$tableName} already exists, skipping...");
            return;
        }

        Schema::create($tableName, function ($table) {
            $table->id();
            $table->string('number')->unique();
            $table->unsignedBigInteger('location_id')->index('r_li');
            $table->unsignedBigInteger('cashier_id')->index('r_ci');
            $table->unsignedBigInteger('customer_id')->nullable()->index('r_cu');
            $table->decimal('total_amount', 15, 2);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('payable_amount', 15, 2);
            $table->string('payment_method');
            $table->string('status')->default('completed');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes()->index();
        });

        $this->info("Created table: {$tableName}");
    }

    /**
     * Create receipt items table for the given date.
     */
    private function createReceiptItemsTable(string $tableName): void
    {
        if (Schema::hasTable($tableName)) {
            $this->warn("Table {$tableName} already exists, skipping...");
            return;
        }

        Schema::create($tableName, function ($table) {
            $table->id();
            $table->unsignedBigInteger('receipt_id')->index('ri_ri');
            $table->unsignedBigInteger('item_id')->index('ri_ii');
            $table->string('name');
            $table->integer('quantity');
            $table->decimal('price', 15, 2);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            $table->timestamps();
            $table->softDeletes()->index('receipt_items_deleted_at');
        });

        $this->info("Created table: {$tableName}");
    }

    /**
     * Validate date format (Y-m).
     */
    private function isValidDate(string $date): bool
    {
        $parts = explode('-', $date);
        if (count($parts) !== 2) {
            return false;
        }

        $year = (int) $parts[0];
        $month = (int) $parts[1];

        return $year >= 2020 && $year <= 2100 && $month >= 1 && $month <= 12;
    }
}

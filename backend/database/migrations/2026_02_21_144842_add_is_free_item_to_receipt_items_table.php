<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $suffix = [
        '',        // Original table (empty suffix)
        '202602',  // Sharded table
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->suffix as $s) {
            $tableName = $s ? 'receipt_items_' . $s : 'receipt_items';
            Schema::table($tableName, function (Blueprint $table) {
                $table->boolean('is_free_item')->default(false)->after('total');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ($this->suffix as $s) {
            $tableName = $s ? 'receipt_items_' . $s : 'receipt_items';
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn('is_free_item');
            });
        }
    }
};

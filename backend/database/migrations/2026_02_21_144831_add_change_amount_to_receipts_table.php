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
            $tableName = $s ? 'receipts_' . $s : 'receipts';
            Schema::table($tableName, function (Blueprint $table) {
                $table->decimal('change_amount', 15, 2)->default(0)->after('payable_amount');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ($this->suffix as $s) {
            $tableName = $s ? 'receipts_' . $s : 'receipts';
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn('change_amount');
            });
        }
    }
};

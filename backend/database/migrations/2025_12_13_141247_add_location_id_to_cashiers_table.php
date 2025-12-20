<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cashiers', function (Blueprint $table) {
            $table->unsignedBigInteger('location_id')->nullable()->index('cashiers_location_id_index');
        });
    }
    public function down(): void
    {
        Schema::table('cashiers', function (Blueprint $table) {
            $table->dropColumn('location_id');
            $table->dropIndex('cashiers_location_id_index');
        });
    }
};

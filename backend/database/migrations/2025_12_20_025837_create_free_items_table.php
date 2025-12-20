<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('free_items', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index('name');
            $table->decimal('required_purchase_amount', 10, 2);
            $table->boolean('is_active')->default(true)->index('is_active');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('free_items');
    }
};

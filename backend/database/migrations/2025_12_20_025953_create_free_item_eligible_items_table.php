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
        Schema::create('free_item_eligible_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('free_item_id')->index('free_item_id');
            $table->unsignedBigInteger('item_id')->index('item_id');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('free_item_eligible_items');
    }
};

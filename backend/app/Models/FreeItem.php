<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FreeItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'required_purchase_amount',
        'is_active',
        'description',
    ];

    protected $casts = [
        'required_purchase_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function eligibleItems()
    {
        return $this->belongsToMany(Item::class, 'free_item_eligible_items')
            ->withTimestamps();
    }

    public function selectableItems()
    {
        return $this->belongsToMany(Item::class, 'free_item_selectable_items')
            ->withTimestamps();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FreeItem extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'required_purchase_amount',
        'is_active',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'required_purchase_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the eligible items for the free item.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function eligibleItems()
    {
        return $this->belongsToMany(Item::class, 'free_item_eligible_items')
            ->withTimestamps();
    }

    /**
     * Get the eligible items for the free item.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function selectableItems()
    {
        return $this->belongsToMany(Item::class, 'free_item_selectable_items')
            ->withTimestamps();
    }
}

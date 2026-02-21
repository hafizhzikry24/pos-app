<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Receipt extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'number',
        'location_id',
        'cashier_id',
        'customer_id',
        'total_amount',
        'discount_amount',
        'tax_amount',
        'payable_amount',
        'change_amount',
        'payment_method',
        'status',
        'note',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'payable_amount' => 'decimal:2',
        'change_amount' => 'decimal:2',
    ];

    /**
     * Get the options for logging activity.
     *
     * @return LogOptions
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty();
    }

    /**
     * Get the receipt items for the receipt.
     */
    public function receiptItems()
    {
        return $this->hasMany(ReceiptItem::class);
    }

    /**
     * Get the location for the receipt.
     */
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the cashier for the receipt.
     */
    public function cashier()
    {
        return $this->belongsTo(Cashier::class);
    }

    /**
     * Get the customer for the receipt.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Location extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'name',
        'address',
    ];

    /**
     * Get the cashiers for the location.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cashiers()
    {
        return $this->hasMany(Cashier::class);
    }

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
     * Get the receipts for the location.
     */
    public function receipts()
    {
        return $this->hasMany(Receipt::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Cashier extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes, LogsActivity;

    /*
     * @var string
     */
    protected $table = 'cashiers';

    /*
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'store_id',
        'phone',
        'address',
        'is_active',
        'location_id',
    ];

    /*
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /*
     * @var array
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
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
     * Get the location for the cashier.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the receipts for the cashier.
     */
    public function receipts()
    {
        return $this->hasMany(Receipt::class);
    }
}

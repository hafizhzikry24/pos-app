<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Cashier extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

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

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

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
}

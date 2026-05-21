<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'phone', 'identity_number', 'address'])]
class Customer extends Model
{
    use HasFactory;

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }
}

<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use App\Models\Cashier;

class UserRepository implements UserRepositoryInterface
{
    /**
     * @param array $data
     * @return \App\Models\User
     */
    public function create(array $data)
    {
        return User::create($data);
    }

    /**
     * @param string $email
     * @return \App\Models\User
     */
    public function findByEmail(string $email)
    {
        return User::where('email', $email)->first();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCashiers()
    {
        return Cashier::all();
    }

    /**
     * @param int $id
     * @return bool
     */
    public function delete($id)
    {
        return User::destroy($id);
    }
}

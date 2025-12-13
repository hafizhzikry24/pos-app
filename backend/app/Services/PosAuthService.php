<?php

namespace App\Services;

use App\Interfaces\CashierRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PosAuthService
{
    private CashierRepositoryInterface $cashierRepository;

    public function __construct(CashierRepositoryInterface $cashierRepository)
    {
        $this->cashierRepository = $cashierRepository;
    }

    /**
     * @param array $data
     * @return \App\Models\Cashier
     */
    public function register(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        return $this->cashierRepository->create($data);
    }

    /**
     * @param array $credentials
     * @return string
     */
    public function login(array $credentials)
    {
        $expectedTokenIdentifier = config('app.pos_token_identifier', 'pos-app');

        if ($credentials['token_identifier'] !== $expectedTokenIdentifier) {
            throw new \Exception('Invalid token identifier', 403);
        }

        $cashier = $this->cashierRepository->findByEmail($credentials['email']);
        
        if (!$cashier || !Hash::check($credentials['password'], $cashier->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if (!$cashier->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account is inactive.'],
            ]);
        }

        return $cashier->createToken('pos_auth_token')->plainTextToken;
    }

    /**
     * @param int $cashierId
     * @param array $data
     * @return \App\Models\Cashier|null
     */
    public function updateProfile(int $cashierId, array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        return $this->cashierRepository->update($cashierId, $data);
    }

    /**
     * @param int $storeId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getCashiersByStore(int $storeId)
    {
        return $this->cashierRepository->getByStoreId($storeId);
    }
}

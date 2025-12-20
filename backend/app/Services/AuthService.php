<?php

namespace App\Services;

use App\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @param array $data
     * @return \App\Models\User
     */
    public function register(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        return $this->userRepository->create($data);
    }

    /**
     * @param array $credentials
     * @return string
     */
    public function login(array $credentials)
    {
        $expectedTokenIdentifier = config('app.token_identifier');

        if ($credentials['token_identifier'] !== $expectedTokenIdentifier) {
            throw new \Exception('Invalid token identifier', 403);
        }

        // Remove token_identifier from credentials before Auth::attempt
        $authCredentials = [
            'email' => $credentials['email'],
            'password' => $credentials['password']
        ];

        if (!Auth::attempt($authCredentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $user = $this->userRepository->findByEmail($credentials['email']);
        return $user->createToken('auth_token')->plainTextToken;
    }
}

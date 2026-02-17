<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        /**
         * bind for repository portal frontend
         */
        $this->app->bind(
            \App\Interfaces\UserRepositoryInterface::class,
            \App\Repositories\UserRepository::class
        );

        /**
         * bind for repository cashier
         */
        $this->app->bind(
            \App\Interfaces\CashierRepositoryInterface::class,
            \App\Repositories\CashierRepository::class
        );

        /**
         * bind for repository location
         */
        $this->app->bind(
            \App\Interfaces\LocationRepositoryInterface::class,
            \App\Repositories\LocationRepository::class
        );

        $this->app->bind(
            \App\Interfaces\ItemRepositoryInterface::class,
            \App\Repositories\ItemRepository::class
        );

        /**
         * bind for repository customer
         */
        $this->app->bind(
            \App\Interfaces\CustomerRepositoryInterface::class,
            \App\Repositories\CustomerRepository::class
        );

        /**
         * bind for repository free item
         */
        $this->app->bind(
            \App\Interfaces\FreeItemRepositoryInterface::class,
            \App\Repositories\FreeItemRepository::class
        );

        $this->app->bind(
            \App\Interfaces\ReceiptRepositoryInterface::class,
            \App\Repositories\ReceiptRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}

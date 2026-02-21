<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule sharding receipt table on the first day of every month at 00:00
Schedule::command('app:sharding-receipt-table')->monthlyOn(1, '00:00');


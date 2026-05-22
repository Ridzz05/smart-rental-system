<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\DashboardController;
use App\Models\Category;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

// 1. Web API Routes
Route::prefix('api')->group(function () {
    // Categories list
    Route::get('categories', function () {
        return response()->json(Category::all());
    });

    // Dashboard stats
    Route::get('dashboard/stats', [DashboardController::class, 'getStats']);

    // Vehicles CRUD
    Route::apiResource('vehicles', VehicleController::class);
    Route::patch('vehicles/{vehicle}/status', [VehicleController::class, 'updateStatus']);

    // Customers CRUD
    Route::apiResource('customers', CustomerController::class);

    // Rentals / Bookings
    Route::get('rentals', [RentalController::class, 'index']);
    Route::post('rentals/book', [RentalController::class, 'book']);
    Route::post('rentals/{id}/return', [RentalController::class, 'returnVehicle']);

    // Authentication
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('me', [AuthController::class, 'updateProfile']);
});

// 2. SPA Fallback Route
Route::fallback(function () {
    return view('app');
});

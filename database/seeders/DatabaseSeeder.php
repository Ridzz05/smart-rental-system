<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default User (for potential future login or admin user)
        User::query()->firstOrCreate(
            ['email' => 'admin@rental.com'],
            [
                'name' => 'Admin Rental',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ],
        );

        // 2. Create Categories
        $categories = [
            [
                'name' => 'SUV',
                'slug' => 'suv',
                'icon' => 'DirectionsCar', // MUI Icon Name
            ],
            [
                'name' => 'MPV',
                'slug' => 'mpv',
                'icon' => 'AirportShuttle', // MUI Icon Name
            ],
            [
                'name' => 'City Car',
                'slug' => 'city-car',
                'icon' => 'ElectricCar', // MUI Icon Name
            ],
            [
                'name' => 'Motorcycle',
                'slug' => 'motorcycle',
                'icon' => 'TwoWheeler', // MUI Icon Name
            ],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['slug']] = Category::create($cat);
        }

        // 3. Create Vehicles
        $vehicles = [
            // SUV
            [
                'category_id' => $categoryModels['suv']->id,
                'brand' => 'Mitsubishi',
                'model' => 'Pajero Sport',
                'license_plate' => 'B 1945 CDE',
                'daily_rate' => 800000.00,
                'status' => 'Available',
                'image_url' => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
            ],
            [
                'category_id' => $categoryModels['suv']->id,
                'brand' => 'Toyota',
                'model' => 'Fortuner 2.8 GR',
                'license_plate' => 'B 2024 GR',
                'daily_rate' => 850000.00,
                'status' => 'Available',
                'image_url' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
            ],
            // MPV
            [
                'category_id' => $categoryModels['mpv']->id,
                'brand' => 'Toyota',
                'model' => 'Innova Zenix Hybrid',
                'license_plate' => 'B 8888 ZNX',
                'daily_rate' => 650000.00,
                'status' => 'Available',
                'image_url' => 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600',
            ],
            [
                'category_id' => $categoryModels['mpv']->id,
                'brand' => 'Toyota',
                'model' => 'Avanza Veloz',
                'license_plate' => 'BG 1234 PAW',
                'daily_rate' => 400000.00,
                'status' => 'Available',
                'image_url' => 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600',
            ],
            [
                'category_id' => $categoryModels['mpv']->id,
                'brand' => 'Suzuki',
                'model' => 'Ertiga Hybrid',
                'license_plate' => 'BG 5678 OPA',
                'daily_rate' => 350000.00,
                'status' => 'Rented',
                'image_url' => 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600',
            ],
            // City Car
            [
                'category_id' => $categoryModels['city-car']->id,
                'brand' => 'Honda',
                'model' => 'Brio RS',
                'license_plate' => 'BG 9999 BRI',
                'daily_rate' => 300000.00,
                'status' => 'Available',
                'image_url' => 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=600',
            ],
            [
                'category_id' => $categoryModels['city-car']->id,
                'brand' => 'Toyota',
                'model' => 'Agya GR Sport',
                'license_plate' => 'B 4321 XYZ',
                'daily_rate' => 275000.00,
                'status' => 'Maintenance',
                'image_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
            ],
            // Motorcycle
            [
                'category_id' => $categoryModels['motorcycle']->id,
                'brand' => 'Yamaha',
                'model' => 'NMAX 155 Connected',
                'license_plate' => 'BG 4444 NMX',
                'daily_rate' => 150000.00,
                'status' => 'Available',
                'image_url' => 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
            ],
            [
                'category_id' => $categoryModels['motorcycle']->id,
                'brand' => 'Honda',
                'model' => 'Beat Deluxe',
                'license_plate' => 'BG 1111 BET',
                'daily_rate' => 80000.00,
                'status' => 'Available',
                'image_url' => 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600',
            ],
        ];

        foreach ($vehicles as $v) {
            Vehicle::create($v);
        }

        // 4. Create Customers
        $customers = [
            [
                'name' => 'Ahmad Faisal',
                'phone' => '081234567890',
                'identity_number' => '1671012345678901',
                'address' => 'Jl. Sudirman No. 10, Palembang',
            ],
            [
                'name' => 'Siti Rahma',
                'phone' => '087890123456',
                'identity_number' => '1671023456789012',
                'address' => 'Jl. Merdeka No. 45, Palembang',
            ],
            [
                'name' => 'John Doe',
                'phone' => '089988776655',
                'identity_number' => '3201011122334455',
                'address' => 'Aston Hotel Room 302, Palembang',
            ],
        ];

        foreach ($customers as $c) {
            Customer::create($c);
        }
    }
}

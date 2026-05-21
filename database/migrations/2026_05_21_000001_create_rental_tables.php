<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon'); // MUI Icon key name (e.g. DirectionsCar, Motorcycle)
            $table->timestamps();
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('identity_number')->unique(); // KTP / Passport number
            $table->text('address')->nullable();
            $table->timestamps();
        });

        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('brand'); // e.g. Toyota, Honda
            $table->string('model'); // e.g. Avanza, Brio
            $table->string('license_plate')->unique(); // e.g. B 1234 ABC
            $table->decimal('daily_rate', 12, 2);
            $table->string('status')->default('Available'); // Available, Rented, Maintenance
            $table->string('image_url')->nullable();
            $table->timestamps();
        });

        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->string('rental_code')->unique(); // e.g. TRX-20260521-0001
            $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_days');
            $table->decimal('total_amount', 12, 2);
            $table->string('status')->default('Ongoing'); // Ongoing, Completed, Cancelled
            $table->string('payment_method'); // Cash, QRIS, Card
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('categories');
    }
};

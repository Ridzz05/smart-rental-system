# Smart Vehicle Rental System Implementation Plan

This document outlines the architecture and execution roadmap for building the **Smart Vehicle Rental System** (Sistem Informasi Rental Kendaraan) inside the `smart-pos` repository.

---

## Technical Stack
- **Backend:** Laravel 12, SQLite database
- **Frontend:** React 19, Material UI (MUI) v6, Tailwind CSS v4, Vite

---

## Proposed Database Schema
- **categories**: `id`, `name`, `slug`, `icon` (MUI Icon string)
- **customers**: `id`, `name`, `phone`, `identity_number` (KTP/Passport), `address`
- **vehicles**: `id`, `category_id`, `brand`, `model`, `license_plate`, `daily_rate`, `status` (Available, Rented, Maintenance), `image_url`
- **rentals**: `id`, `rental_code`, `vehicle_id`, `customer_id`, `start_date`, `end_date`, `total_days`, `total_amount`, `status` (Ongoing, Completed, Cancelled), `payment_method`, `created_at`

---

## API Endpoints (`routes/web.php`)
- `GET /api/dashboard/stats`: Core statistics (Revenue, Vehicles on Road, Available count, upcoming returns)
- `GET/POST/PUT/DELETE /api/customers`: Manage customers database
- `GET/POST/PUT/DELETE /api/vehicles`: Manage fleet/vehicles catalog
- `GET /api/rentals`: Bookings/rentals list and history
- `POST /api/rentals/book`: Complete a new booking (sets vehicle status to Rented)
- `POST /api/rentals/{id}/return`: Process vehicle return (restores vehicle status to Available)

---

## Frontend Layout & Pages
1. **Layout Wrapper (`Layout.jsx`):** Sidebar navigation, responsive drawer, header with dark/light mode toggle.
2. **Dashboard (`Dashboard.jsx`):** High-level metrics, vehicle status breakdown, and return alerts.
3. **Rental Desk (`RentalDesk.jsx`):**
   - Available Fleet grid with category filtering and search.
   - Interactive booking form (customer search, date pickers, automatic cost calculation).
   - Checkout panel & digital invoice receipt drawer.
4. **Fleet Management (`Fleet.jsx`):** Interactive data grid for managing vehicles, status, and rates.
5. **Customer Directory (`Customers.jsx`):** CRM-like interface for managing client databases and history.
6. **Rentals Overview (`Rentals.jsx`):** Main control room to view ongoing contracts and trigger returns.

---

## Action Items & Setup
1. Run migrations and seeders:
   ```bash
   php artisan migrate:fresh --seed
   ```
2. Verify that npm dependencies are installed locally:
   ```bash
   npm install
   ```
3. Run the development environment:
   ```bash
   npm run dev
   ```

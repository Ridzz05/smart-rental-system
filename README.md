# 🚗 Smart Rental System

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/MUI-6.x-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)

An ultra-responsive, premium Car Rental Management System designed to simplify fleet operations, rental tracking, and dashboard analytics. Built with a high-fidelity modern UI that adaptively scales from desktop power-views down to immersive mobile-first visual experiences.

---

## ✨ Key Features

- 📊 **Dynamic Analytics Dashboard**: Track active rentals, revenue metrics, fleet availability, and overall performance in real-time.
- 🚗 **Fleet Management**: Easily manage rental vehicles, check statuses, and update car specifications.
- 💼 **Smart Rental Desk**: Direct rental dispatch interface for quick check-ins, check-outs, and customer allocations.
- 👤 **Customer CRM**: Maintain a centralized registry of active and past renters with ease.
- 📱 **Mobile-Optimized Cinematic UI**:
  - Immersive **video-playback backgrounds** (powered by BMW M3 cinematic sequences) for mobile auth views.
  - Ultra-modern **fully transparent** cards, input fields, and action buttons for a sleek, floating-glass aesthetic.
  - Seamless toggle tabs to transition between login and registration layouts in a single tap.

---

## 🛠️ Tech Stack

- **Backend**: Laravel 11.x (PHP 8.x)
- **Frontend**: React 19.x + Material UI 6.x (MUI) & Tailwind CSS v4.0
- **Bundler**: Vite
- **Database**: MySQL

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **PHP** (8.2+)
- **Composer**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Ridzz05/smart-rental-system.git
cd smart-rental-system

# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Copy environment file and configure database
cp .env.example .env
php artisan key:generate

# Run migrations & seeders (if available)
php artisan migrate
```

### 3. Running Locally
```bash
# Start Laravel development server
php artisan serve

# Run Vite dev server in a parallel terminal
npm run dev
```
